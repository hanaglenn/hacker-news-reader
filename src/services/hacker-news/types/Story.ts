export type Story = {
  id: StoryId;
  title: string;
  author: string;
  postedAt: number;
  url: string;
}

export type StoryId = number;
