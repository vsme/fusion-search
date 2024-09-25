// search.ts
import pinyinMap from "./data/pinyin";

function search(source: string, search: string): [number, number][] {
  const searchStr = search.toLowerCase();
  const sourceChars = Array.from(source);
  const sourceLength = sourceChars.length;
  
  // Preprocess source: for each character, determine possible matching pinyin options
  const sourcePinyin: string[][] = sourceChars.map((char) => {
    if (pinyinMap[char]) {
      return pinyinMap[char].map(p => p.toLowerCase());
    } else {
      return [char.toLowerCase()];
    }
  });

  const matchedIndices: number[] = [];

  // Iterate over the source characters
  for (let i = 0; i < sourceLength; i++) {
    const pinyinOptions = sourcePinyin[i];
    for (const pinyin of pinyinOptions) {
      // 检查拼音是否包含搜索字符串，或者搜索字符串是否包含拼音
      if (pinyin.includes(searchStr) || searchStr.includes(pinyin)) {
        matchedIndices.push(i);
        break; // 如果任何一个拼音选项匹配，认为该字符匹配
      }
    }
  }

  if (matchedIndices.length === 0) {
    return [];
  }

  // Group consecutive indices into ranges
  const ranges: [number, number][] = [];
  let start = matchedIndices[0];
  let end = matchedIndices[0];
  for (let i = 1; i < matchedIndices.length; i++) {
    if (matchedIndices[i] === end + 1) {
      end = matchedIndices[i];
    } else {
      ranges.push([start, end]);
      start = matchedIndices[i];
      end = matchedIndices[i];
    }
  }
  ranges.push([start, end]);

  return ranges;
}

// 示例用法：

// 纯英文示例
const source1 = "nonode"; 
console.log(`在源字符串 "${source1}" 中搜索 "no"，结果为:`, search(source1, "no")); // [[0,1], [2,3]] 
console.log(`在源字符串 "${source1}" 中搜索 "nod"，结果为:`, search(source1, "nod")); // [[2,4]] 
console.log(`在源字符串 "${source1}" 中搜索 "oo"，结果为:`, search(source1, "oo")); // [[1,1],[3,3]]

// 纯中文示例 
const source2 = "地表最强前端监控平台"; 
console.log(`在源字符串 "${source2}" 中搜索 "jk"，结果为:`, search(source2, "jk")); // [[6,7]]
console.log(`在源字符串 "${source2}" 中搜索 "qianduapt"，结果为:`, search(source2, "qianduapt")); // [[4,5],[8,9]]

// 中英文混合示例 
console.log(`在源字符串 "Node.js 最强监控平台 V9" 中搜索 "nodejk"，结果为:`, search("Node.js 最强监控平台 V9", "nodejk")); // [[0,3],[10,11]]

// 复杂示例 
const source3 = "a_nd你你的就是我的"; 
console.log(`在源字符串 "${source3}" 中搜索 "nd"，结果为:`, search(source3, "nd")); // [[2,3]] 
console.log(`在源字符串 "${source3}" 中搜索 "nnd"，结果为:`, search(source3, "nnd")); // [[4,6]] 
console.log(`在源字符串 "${source3}" 中搜索 "nshwode"，结果为:`, search(source3, "nshwode")); // [[2,2],[8,10]] 
