import { ensureCocosMetadata } from "./lib/cocos-metadata.mjs";

const count = await ensureCocosMetadata();
console.log(`Generated ${count} stable Cocos asset metadata files.`);
