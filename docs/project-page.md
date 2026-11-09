# Project page content

Edit `src/sections/project/project-content.ts` to replace the three image paths, add any number of paragraphs to `projectStory`, and change the film and its overlay title.

`src/app/project/page.tsx` renders three independent sections in order: `ProjectGallery`, `ProjectStory`, and `ProjectFilm`, all in `src/sections/project/`.

Each paragraph reveals word by word from 50% to 100% opacity as it crosses the 75% viewport reading line. Its final word finishes before the following paragraph starts. Scrolling upward reverses the effect. Reduced motion displays all text at full opacity.

The text reveal is calculated directly from scroll progress, with font-loading and resize measurements refreshed before use. The film stays full width with a fixed bottom edge; its top edge extends upward as you scroll, without scaling or stretching the video pixels.

The film is a temporary copy of the [reference clip](https://sobha-privy-collection.com/uploads/teaser.mp4) requested for matching the [reference section](https://sobha-privy-collection.com/). Replace `public/videos/project/reference-placeholder.mp4` with your own sustainability video before publishing the final content. Change `projectVideo.poster` to its matching still image.

Photos are replaceable Unsplash placeholders, stored locally under `public/images/project/`.
