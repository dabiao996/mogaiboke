export interface ResourceItem {
  id: string;
  slug: string;
  name: string;
  type: string;
  description: string;
  link: string;
  category: string;
  tags: string[];
  cover?: string;
  recommended?: boolean;
  rating?: number;
  favorite?: boolean;
}

export const resourcesData: ResourceItem[] = [
  {
    id: "res-gromacs",
    slug: "gromacs-official",
    name: "GROMACS Official Documentation",
    type: "文档",
    description: "分子动力学模拟常用的官方文档，适合查命令、参数和工作流。",
    link: "https://manual.gromacs.org/",
    category: "科研",
    tags: ["GROMACS", "Molecular Dynamics", "Documentation"],
    cover: "https://bu.dusays.com/2026/03/24/69c1e38b346cb.jpg",
    recommended: true,
    rating: 5,
    favorite: true,
  },
  {
    id: "res-react",
    slug: "react-docs",
    name: "React Docs",
    type: "教程",
    description: "React 官方文档，适合查 Hook、组件模式和现代前端实践。",
    link: "https://react.dev/",
    category: "前端",
    tags: ["React", "Frontend", "Hooks"],
    recommended: true,
    rating: 5,
  },
  {
    id: "res-cs144",
    slug: "cs144",
    name: "CS144 Computer Networking",
    type: "课程",
    description: "系统性学习计算机网络的一门经典课程，适合打基础和补体系。",
    link: "https://cs144.github.io/",
    category: "计算机基础",
    tags: ["Network", "CS", "Course"],
    rating: 4,
  },
];
