'use server'
import { saveGeneratedContent, updateUserPoints } from "@/utils/db/actions";
import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const MAX_TWEET_LENGTH = 280;
const POINTS_PER_GENERATION = 5;

interface GenerateContentProps {
  userId: string;
  contentType: 'twitter' | 'instagram' | 'linkedin';
  prompt: string;
  image?: File;
}

interface GeneratedContent {
  content: string[];
  updatedPoints: number;
}

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const handleGenerate = async ({
  userId,
  contentType,
  prompt,
  image
}: GenerateContentProps): Promise<GeneratedContent> => {
  if (!genAI) {
    throw new Error("API key not set or invalid");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const basePrompt = `Generate premium, high-impact ${contentType} content about "${prompt}". Ensure the content is engaging, relevant, and optimized for the platform.`;
    
    const contentTypeInstructions = {
      twitter: "Provide a thread of 5 tweets, each under 280 characters. Make each tweet impactful, use relevant hashtags, and encourage engagement. Consider including a mix of statements, questions, and calls-to-action.",
      instagram: "Create a captivating caption that's both visually descriptive and emotionally resonant. Include a storytelling element, 5-7 relevant hashtags, and a clear call-to-action. Aim for 150-200 words.",
      linkedin: "Craft a professional post that demonstrates industry expertise. Include data points or statistics if relevant, tell a brief story or case study, and end with a thought-provoking question or call-to-action to encourage networking or discussion. Aim for 200-300 words."
    };
    
    const audienceTargeting = `Target audience: professionals in the ${prompt.split(' ')[0]} industry.`;
    
    const contentStrategy = `Content strategy: Educate, inspire, and provoke thought. Use a tone that's ${contentType === 'linkedin' ? 'professional and authoritative' : 'friendly yet knowledgeable'}.`;
    
    const performanceMetrics = `Optimize for the following metrics: engagement rate, shares, and ${contentType === 'twitter' ? 'retweets' : contentType === 'instagram' ? 'saves' : 'comments'}.`;
    
    let fullPrompt = `${basePrompt}
    
    ${contentTypeInstructions[contentType]}
    
    ${audienceTargeting}
    
    ${contentStrategy}
    
    ${performanceMetrics}
    
    Ensure the content is original, factually accurate, and aligns with current best practices for ${contentType} content creation.`;

    let imagePart: Part | null = null;
    if (contentType === "instagram" && image) {
      // Handle image processing securely on the server
      // This is a placeholder and should be implemented according to your server setup
      const imageBuffer = await image.arrayBuffer();
      const base64Data = Buffer.from(imageBuffer).toString('base64');
      imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: image.type,
        },
      };
      fullPrompt += " Describe the image and incorporate it into the caption.";
    }

    const parts: (string | Part)[] = [fullPrompt];
    if (imagePart) parts.push(imagePart);

    const result = await model.generateContent(parts);
    const generatedText = result.response.text();

    let content: string[];
    if (contentType === "twitter") {
      content = generatedText
        .split("\n\n")
        .filter((tweet) => tweet.trim() !== "")
        .slice(0, 5); // Ensure we only get max 5 tweets
    } else {
      content = [generatedText];
    }

    // Update points
    const updatedUser = await updateUserPoints(userId, -POINTS_PER_GENERATION);
    
    // Save generated content
    await saveGeneratedContent(userId, content.join("\n\n"), prompt, contentType);

    // Revalidate the path to update the UI
    revalidatePath('/generate');

    return {
      content,
      updatedPoints: updatedUser ? updatedUser.points! : 0
    };
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate content");
  }
};

export async function generateContentServer(
  userId: string,
  contentType: string,
  prompt: string,
  image?: { data: string; mimeType: string }
) {
  if (!genAI) {
    throw new Error("Gemini API key is not set");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const basePrompt = `Create exceptional, high-impact ${contentType} content about "${prompt}". The content should be engaging, relevant, and optimized for the platform, while maintaining a natural, human-like tone.`;
  
  const contentTypeInstructions = {
    twitter: "Craft a thread of 5 tweets, each under 280 characters. Vary the structure and tone of each tweet to maintain interest. Use impactful language, relevant hashtags, and encourage engagement. Mix statements, questions, and calls-to-action. Ensure a cohesive narrative across the thread.",
    instagram: "Develop a captivating caption that's visually descriptive and emotionally resonant. Incorporate storytelling elements, 5-7 carefully chosen hashtags, and a subtle yet effective call-to-action. Aim for 150-200 words, balancing informative content with relatable, conversational language.",
    linkedin: "Create a thought-provoking professional post that showcases industry expertise. Weave in relevant data points or statistics, share a brief but impactful case study or personal anecdote, and conclude with an insightful question or call-to-action to spark meaningful discussions. Aim for 200-300 words, maintaining a professional yet approachable tone."
  };
  
  const audienceTargeting = `Target audience: Professionals in the ${prompt.split(' ')[0]} industry, considering their interests, pain points, and aspirations.`;
  
  const contentStrategy = `Content strategy: Educate, inspire, and provoke thought. Adopt a tone that's ${contentType === 'linkedin' ? 'professional and authoritative, yet conversational' : 'friendly and knowledgeable, with a touch of personality'}. Use varied sentence structures and occasional rhetorical devices to enhance engagement.`;
  
  const performanceMetrics = `Optimize for the following metrics: high engagement rate, increased shares, and ${contentType === 'twitter' ? 'retweets and quote tweets' : contentType === 'instagram' ? 'saves and comments' : 'thoughtful comments and professional connections'}. Craft content that naturally encourages these actions without being overly promotional.`;
  
  let fullPrompt = `${basePrompt}

  ${contentTypeInstructions[contentType as keyof typeof contentTypeInstructions]}

  ${audienceTargeting}

  ${contentStrategy}

  ${performanceMetrics}

  Ensure the content is original, factually accurate, and aligns with current best practices for ${contentType} content creation. Inject personality and authenticity to make the content feel genuinely human-written.`;

  const parts: (string | Part)[] = [fullPrompt];
  if (contentType === "instagram" && image) {
    parts.push({
      inlineData: {
        data: image.data,
        mimeType: image.mimeType,
      },
    });
    fullPrompt += " Analyze the image thoughtfully and weave its description naturally into the caption, creating a seamless connection between visual and textual elements.";
  }

  const result = await model.generateContent(parts);
  const generatedText = result.response.text();

  let content: string[];
  if (contentType === "twitter") {
    content = generatedText
      .split("\n\n")
      .filter((tweet) => tweet.trim() !== "")
      .map(tweet => tweet.replace(/^(Tweet \d+: )?/, '').trim()) // Remove "Tweet X:" prefixes if present
      .slice(0, 5); // Ensure we only get max 5 tweets
  } else {
    content = [generatedText.trim()];
  }

  // Update points
  const updatedUser = await updateUserPoints(userId, -5);

  // Save generated content
  const savedContent = await saveGeneratedContent(
    userId,
    content.join("\n\n"),
    prompt,
    contentType
  );

  return {
    content,
    updatedUser,
    savedContent,
  };
}