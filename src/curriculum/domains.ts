import { worlds as originalWorlds } from "../data/games";
export const worlds = [...originalWorlds,
  {id:'memory' as const,name:'记忆小屋',summary:'记位置、听指令、找线索'},
  {id:'language' as const,name:'语言花园',summary:'听说、复述、词语和表达'},
  {id:'life' as const,name:'生活实验室',summary:'观察、动手、解释和发现'},
];
