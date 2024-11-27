export const blogInfo = {
  name: "Atmoscapes Blog",
  description: "We Make the Web Sound Awesome!",
}

export type BlogPost = {
  id: number
  link: string
  date: string // date is a string 'YYYY-MM-DD'
  title: string
  description: string
  image: string
  parsedDate?: Date // Optional because it's added dynamically
}

  
// Update this list with the actual blog post list
// Create a page in the "(posts)" directory for each entry
export const blogPosts: BlogPost[] = [
  {
    id: 0,
    title: "A Complete Guide to Audio Processing in the Browser with JavaScript",
    description: "Discover how to leverage the power of the Web Audio API and JavaScript libraries to build immersive audio applications directly in the browser. Learn about techniques, tools, and real-world applications to create dynamic audio experiences on the web.",
    link: "/blog/doing-audio-processing-in-the-browser-with-javascript",
    image: "",
    date: "2024-09-04",
  },
  {
    id: 1,
    title: "How to Create a Technical Brief for Your Audio Project: A Comprehensive Guide",
    description: "This guide helps you craft a detailed technical brief for your audio project, ensuring clear communication of your goals, requirements, and expectations. Learn how to define objectives, outline technical needs, and set success criteria to ensure your project runs smoothly and meets all your targets.",
    link: "/blog/how-to-create-a-technical-brief-for-your-audio-project",
    image: "",
    date: "2024-09-05",
  },
  {
    id: 2,
    title: "Building AI Audio and Generative Music Applications",
    description: "Explore the exciting possibilities of AI-driven audio and generative music applications. This article introduces key AI audio technologies, essential libraries, and leading companies in the field, offering insights to help you develop innovative audio solutions that push the boundaries of sound.",
    link: "/blog/building-ai-audio-and-generative-music-applications",
    image: "",
    date: "2024-09-06",
  },
  {
    id: 3,
    title: "Why Svelte is a Great Choice for Web Audio API Applications",
    description: "In this article, we explore how Svelte's minimalism, reactivity, and speed make it a powerful framework for crafting immersive audio experiences directly in the browser. Whether you're developing a music player, synthesizer, or generative soundscape tool, Svelte allows you to focus on your audio code without compromising on modern UI design.",
    link: "/blog/why-svelte-is-a-great-choice-for-web-audio-api-applications",
    image: "",
    date: "2024-09-19",
  },
  {
    id: 4,
    title: "How to Build an Audio Editing Application for the Browser",
    description: "Discover how to build a browser-based audio editing application using Web Audio API. From real-time collaboration to marketplace integration, this guide covers essential features and technologies for creating powerful, user-friendly music editing SaaS.",
    link: "/blog/how-to-build-an-audio-editing-application-for-the-browser",
    image: "",
    date: "2024-09-27",
  },
  {
    id: 5,
    title: "Building an FL Studio-Like Music DAW in the Browser with Web Audio API",
    description: "Explore how we bring the magic of FL Studio to the browser using Web Audio API. We can recreate piano rolls, mixers, and more - just without the million-dollar price tag!",
    link: "/blog/building-an-fl-studio-like-music-daw-in-the-browser-with-web-audio-api",
    image: "",
    date: "2024-09-28",
  },
]

// Parse post dates from strings to Date objects
for (const post of blogPosts) {
  if (!post.parsedDate) {
    const dateParts = post.date.split("-")
    post.parsedDate = new Date(
      parseInt(dateParts[0]),
      parseInt(dateParts[1]) - 1,
      parseInt(dateParts[2]),
    ) // Note: months are 0-based
  }
}

export const sortedBlogPosts = blogPosts.sort(
  (a: BlogPost, b: BlogPost) =>
    (b.parsedDate?.getTime() ?? 0) - (a.parsedDate?.getTime() ?? 0),
)
