import fs from "fs";
import dict from './dict-zi'
// const dict: Record<number, string> = {};

// dict[0x4e27] = "sāng,sàng"; /* 丧 */
// dict[0x4e28] = "gǔn"; /* 丨 */
// dict[0x4e29] = "jiū"; /* 丩 */
// dict[0x4e2a] = "gè,gě"; /* 个 */
// ....

const pinyinMap: Record<string, string[]> = {};

function stripTones(pinyin: string): string {
  return pinyin.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

Object.keys(dict).forEach(key => {
  const numberKey = Number(key); // 解析为十进制数字
  if (isNaN(numberKey)) {
    console.warn(`键 "${key}" 不是有效的数字。`);
    return;
  }

  const value = dict[key as unknown as number];
  const char = String.fromCodePoint(numberKey);

  // 检查是否是中文字符
  if (/[\u4e00-\u9fff]/.test(char) && typeof value === 'string') {
    const pinyins = [...new Set(value.split(',').map((p) => stripTones(p)))];
    pinyinMap[char] = pinyins;
  }
});

console.log(`共提取 ${Object.keys(pinyinMap).length} 字`);

fs.writeFileSync('src/data/pinyin.ts', `const pinyin: Record<string, string[]> = ${JSON.stringify(pinyinMap)};
export default pinyin;
`, 'utf-8');
