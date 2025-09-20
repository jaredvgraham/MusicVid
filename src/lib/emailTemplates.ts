export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  message: string;
  description: string;
  category: "welcome" | "engagement" | "promotional" | "support" | "custom";
  headerTitle: string;
  headerSubtitle: string;
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "welcome-new-users",
    name: "Welcome New Users",
    subject: "Welcome to Sonexa - Let's Create Your First Video!",
    message: `Welcome to Sonexa! 🎵

We're thrilled to have you join our community of music video creators. 

Getting started is easy:
• Upload your favorite song
• Add your lyrics or let our AI transcribe them
• Choose from beautiful templates
• Create stunning lyric videos in minutes

Ready to make your first video? 

🎬 [Start Creating at Sonexa.cc](https://sonexa.cc)

If you have any questions, our support team is here to help.

Happy creating!`,
    description:
      "Welcome message for new users who haven't created their first project",
    category: "welcome",
    headerTitle: "🎵 Welcome to Sonexa!",
    headerSubtitle: "Create stunning lyric videos with AI-powered timing",
  },
  {
    id: "re-engagement-inactive",
    name: "Re-engage Inactive Users",
    subject: "Your Sonexa Account is Ready - Don't Miss Out!",
    message: `Hi there! 👋

We noticed you signed up for Sonexa but haven't created your first video yet. 

Creating lyric videos has never been easier:
✨ Upload any song
✨ Add lyrics automatically or manually
✨ Choose from professional templates
✨ Export in HD quality

Many users create their first video in under 5 minutes!

Ready to get started? 

🎬 [Create Your First Video at Sonexa.cc](https://sonexa.cc)

Need help getting started? Reply to this email and we'll guide you through it.

Your creative journey starts now!`,
    description:
      "Re-engagement message for users who signed up but haven't created projects",
    category: "engagement",
    headerTitle: "🎬 Your Creative Journey Awaits!",
    headerSubtitle: "Don't miss out on creating amazing lyric videos",
  },
  {
    id: "feature-announcement",
    name: "New Features Announcement",
    subject: "🎉 New Features Available in Sonexa!",
    message: `Exciting news! We've added amazing new features to Sonexa:

🚀 New Features:
• Advanced text animations
• More font options
• Custom color palettes
• Faster rendering
• Mobile app improvements

These features are available to all users right now!

🎬 [Try New Features at Sonexa.cc](https://sonexa.cc)

We'd love to hear what you think!

Keep creating amazing content!`,
    description: "Announcement for new features and updates",
    category: "promotional",
    headerTitle: "🎉 Exciting New Features!",
    headerSubtitle: "Discover what's new in Sonexa",
  },
  {
    id: "pro-upgrade",
    name: "Pro Plan Upgrade",
    subject: "Unlock Unlimited Creativity with Sonexa Pro",
    message: `Ready to take your lyric videos to the next level? 

Sonexa Pro gives you:
• Unlimited projects
• No watermarks
• Premium templates
• Priority support
• Advanced customization

Join thousands of creators who've upgraded to Pro and are creating professional-quality videos.

Special offer: 20% off your first month!

💎 [Upgrade to Pro at Sonexa.cc](https://sonexa.cc/pricing)

Unleash your creativity!`,
    description: "Promotional message for Pro plan upgrade",
    category: "promotional",
    headerTitle: "💎 Unlock Pro Features!",
    headerSubtitle: "Take your videos to the next level",
  },
  {
    id: "support-follow-up",
    name: "Support Follow-up",
    subject: "How can we help you succeed with Sonexa?",
    message: `Hi! We hope you're enjoying Sonexa.

We're here to help you create amazing lyric videos. If you're experiencing any issues or have questions, please don't hesitate to reach out.

Common solutions:
• Check our help center
• Watch tutorial videos
• Contact support directly

🎬 [Visit Sonexa.cc for Help](https://sonexa.cc)

We want to make sure you have the best experience possible.

What can we help you with today?`,
    description: "Support follow-up message for users who might need help",
    category: "support",
    headerTitle: "🤝 We're Here to Help!",
    headerSubtitle: "Let us support your creative journey",
  },
  {
    id: "maintenance-notification",
    name: "Maintenance Notification",
    subject: "Sonexa is Back Online - Your Projects are Ready!",
    message: `Hi there! 👋

We wanted to reach out personally about the recent maintenance we performed on Sonexa.

We've resolved the issues that may have affected your video creation process. Our systems are now fully operational and running smoothly.

🎬 [Create a New Project at Sonexa.cc](https://sonexa.cc)

What's improved:
✨ Faster rendering times
✨ Enhanced stability
✨ Better error handling
✨ Improved user experience

We apologize for any inconvenience this may have caused. We're committed to providing you with the best possible experience.

If you encounter any issues, please don't hesitate to reach out to our support team.

Thank you for your patience and continued support!

Happy creating!`,
    description:
      "Notification for users whose projects may have failed due to maintenance",
    category: "support",
    headerTitle: "🔧 We're Back Online!",
    headerSubtitle: "Your video creation experience is now better than ever",
  },
  {
    id: "custom",
    name: "Custom Template",
    subject: "",
    message: "",
    description: "Create your own custom email template",
    category: "custom",
    headerTitle: "🎵 Sonexa",
    headerSubtitle: "Create stunning lyric videos with AI-powered timing",
  },
];

export const getTemplateById = (id: string): EmailTemplate | undefined => {
  return EMAIL_TEMPLATES.find((template) => template.id === id);
};

export const getTemplatesByCategory = (
  category: EmailTemplate["category"]
): EmailTemplate[] => {
  return EMAIL_TEMPLATES.filter((template) => template.category === category);
};
