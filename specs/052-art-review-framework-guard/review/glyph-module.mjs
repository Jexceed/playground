import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
const logicHouseItems = {
  logic046Daily_placeCookies: { src: "/images/items/logic-046-daily-placeCookies.png", alt: "干净的手把饼干盛到蓝边白盘里。" },
  logic046Daily_eatFromPlate: { src: "/images/items/logic-046-daily-eatFromPlate.png", alt: "孩子用干净的手从盘子里拿饼干吃。" },
  "logic046Daily_loosePencils": {
    "src": "/images/items/logic-046-daily-loosePencils.png",
    "alt": "四支铅笔散放在桌面上，尚未收进文具盒。"
  },
  "logic046Daily_thirsty": {
    "src": "/images/items/logic-046-daily-thirsty.png",
    "alt": "橙衣孩子轻摸喉咙表示口渴，手里没有杯子、水壶或食物。"
  },
  "logic046Daily_hungry": {
    "src": "/images/items/logic-046-daily-hungry.png",
    "alt": "橙衣孩子轻摸肚子，饿了等待吃东西，没有拿食物或饭盒。"
  },
  "logic046Daily_sunnyChild": {
    "src": "/images/items/logic-046-daily-sunnyChild.png",
    "alt": "阳光明亮，橙衣孩子在门内准备到户外，头上无帽、双手空着。"
  },
  "logic046Daily_rainWindow": {
    "src": "/images/items/logic-046-daily-rainWindow.png",
    "alt": "窗外明显下雨，玻璃上有雨滴，没有雨衣或雨伞。"
  },
  "logic046Daily_openStoryBook": {
    "src": "/images/items/logic-046-daily-openStoryBook.png",
    "alt": "打开的图画故事书，两页是小兔在草地上的连续故事画面，没有文字。"
  },
  "logic046Daily_closedPencilCase": {
    "src": "/images/items/logic-046-daily-closedPencilCase.png",
    "alt": "蓝色拉链文具袋完全合好，拉链闭合，没有铅笔露出。"
  },
  "logic046Daily_emptyBasket": {
    "src": "/images/items/logic-046-daily-emptyBasket.png",
    "alt": "空藤编收纳篮，正面和空的内部清楚可见。"
  },
  "logic046Daily_studyCue": {
    "src": "/images/items/logic-046-daily-studyCue.png",
    "alt": "橙衣孩子坐在教室空桌前准备学习，双手空着，桌上没有学习用品。"
  },
  "logic046Daily_clap": {
    "src": "/images/items/logic-046-daily-clap.png",
    "alt": "橙衣孩子在胸前双手拍在一起，正在拍手。"
  },
  "logic046Daily_hugShoulders": {
    "src": "/images/items/logic-046-daily-hugShoulders.png",
    "alt": "橙衣孩子双臂交叉，双手分别放在对侧肩膀上。"
  },
  "logic046Daily_touchHead": {
    "src": "/images/items/logic-046-daily-touchHead.png",
    "alt": "橙衣孩子抬起双臂，双手放在头顶上。"
  },
  "logic046Daily_stone": {
    "src": "/images/items/logic-046-daily-stone.png",
    "alt": "一颗小而圆润的灰色卵石。"
  },
  "logic046Evidence_cakeCat": {
    "src": "/images/items/logic-046-evidence-cakeCat.png",
    "alt": "同一厨房里的小猫，嘴边和前爪有可见奶油。"
  },
  "logic046Evidence_cakeDog": {
    "src": "/images/items/logic-046-evidence-cakeDog.png",
    "alt": "同一厨房远处，小狗蜷在蓝垫子上睡觉，身上未见奶油。"
  },
  "logic046Evidence_cakeRabbit": {
    "src": "/images/items/logic-046-evidence-cakeRabbit.png",
    "alt": "同一厨房里的灰兔抱着胡萝卜，身上未见奶油。"
  },
  "logic046Evidence_cakeCream": {
    "src": "/images/items/logic-046-evidence-cakeCream.png",
    "alt": "原场景小猫嘴边和前爪的白色奶油近景。"
  },
  "logic046Evidence_cakeKitchenContext": {
    "src": "/images/items/logic-046-evidence-cakeKitchenContext.png",
    "alt": "同一厨房全景，说明各角色在厨房中的位置；不增加行为证据。"
  },
  "logic046Evidence_cakeMissing": {
    "src": "/images/items/logic-046-evidence-cakeMissing.png",
    "alt": "原场景蛋糕的扇形缺口与桌面近景。"
  },
  "logic046Evidence_spillCup": {
    "src": "/images/items/logic-046-evidence-spillCup.png",
    "alt": "原场景倒下的蓝色水杯和紧邻水洼，不新增脚印或碰撞痕迹。"
  },
  "logic046Evidence_spillDog": {
    "src": "/images/items/logic-046-evidence-spillDog.png",
    "alt": "原场景远处蓝垫子上睡着的小狗及其周围地板。"
  },
  "logic046Evidence_spillBird": {
    "src": "/images/items/logic-046-evidence-spillBird.png",
    "alt": "原场景停在窗台上的蓝色小鸟和窗边区域。"
  },
  "logic046Evidence_flowerCat": {
    "src": "/images/items/logic-046-evidence-flowerCat.png",
    "alt": "原场景花坛边的小猫，抬起的前爪有黄色花粉。"
  },
  "logic046Evidence_flowerRabbit": {
    "src": "/images/items/logic-046-evidence-flowerRabbit.png",
    "alt": "原场景抱着胡萝卜的小兔，身上未见花粉。"
  },
  "logic046Evidence_flowerPollen": {
    "src": "/images/items/logic-046-evidence-flowerPollen.png",
    "alt": "原场景小猫抬起前爪的黄色花粉近景。"
  },
  "logic046Evidence_flowerBent": {
    "src": "/images/items/logic-046-evidence-flowerBent.png",
    "alt": "原场景花坛中弯折的花、散落花瓣和土壤。"
  },
  "logic046Evidence_mudDog": {
    "src": "/images/items/logic-046-evidence-mudDog.png",
    "alt": "原场景站在泥地里的小狗，四脚沾有泥。"
  },
  "logic046Evidence_mudCat": {
    "src": "/images/items/logic-046-evidence-mudCat.png",
    "alt": "原场景坐在干净圆垫上的灰猫，爪子可见且无泥。"
  },
  "logic046Evidence_mudRabbit": {
    "src": "/images/items/logic-046-evidence-mudRabbit.png",
    "alt": "原场景抱胡萝卜的白兔，脚下草地可见且未见泥。"
  },
  "logic046Evidence_mudPaws": {
    "src": "/images/items/logic-046-evidence-mudPaws.png",
    "alt": "原场景小狗沾泥的脚与湿泥地近景。"
  },
  "logic046Evidence_mudTracks": {
    "src": "/images/items/logic-046-evidence-mudTracks.png",
    "alt": "原场景地面已有的泥脚印，不推定脚印一定属于哪个角色。"
  },
  "logic046Evidence_weakCat": {
    "src": "/images/items/logic-046-evidence-weakCat.png",
    "alt": "修正场景中门口的灰猫，嘴边和前爪干净；只表示当前状态。"
  },
  "logic046Evidence_weakCatContext": {
    "src": "/images/items/logic-046-evidence-weakCatContext.png",
    "alt": "修正场景的厨房与门口位置，灰猫清醒站着且未接触蛋糕。"
  },
  "logic046Evidence_weakDog": {
    "src": "/images/items/logic-046-evidence-weakDog.png",
    "alt": "原场景小狗清醒地坐在门口，未接触玩具；不是睡觉。"
  },
  "logic046Evidence_weakDogContext": {
    "src": "/images/items/logic-046-evidence-weakDogContext.png",
    "alt": "原场景玩具散落的游戏房和门口清醒的小狗；没有新增作乱行为。"
  },
  "logic046Evidence_weakToys": {
    "src": "/images/items/logic-046-evidence-weakToys.png",
    "alt": "原场景地毯上散落的玩具近景，不增加小狗行为或脚印。"
  },
  "logic046Life_cleanWashAgain": {
    "src": "/images/items/logic-046-life-cleanWashAgain.png",
    "alt": "已经干净的双手又在水龙头下搓洗，皮肤没有泥污。"
  },
  "logic046Life_dirtyMoreCookies": {
    "src": "/images/items/logic-046-life-dirtyMoreCookies.png",
    "alt": "孩子两手仍有泥，已经拿着两块饼干，又伸泥手拿更多饼干，还没有洗手。"
  },
  "logic046Life_slowRed": {
    "src": "/images/items/logic-046-life-slowRed.png",
    "alt": "行人红灯时孩子想小步慢挪，大人牵住孩子，双脚仍在路缘后的人行道上。"
  },
  "logic046Life_takeOutSort": {
    "src": "/images/items/logic-046-life-takeOutSort.png",
    "alt": "孩子从混装盒中取出积木，在盒外把积木和小车分成两堆；原盒仍有部分混杂玩具，另一盒为空。"
  }
};
const orderStoryItems = {
  "order045_plant_drySprout": { src: "/images/items/order-045-plant-drySprout.png", alt: "只有两叶的小芽，花盆土面明显干裂，没有花或浇水动作" },
  "order045_door_locked": {
    "src": "/images/items/order-045-door-locked.png",
    "alt": "门锁着，孩子拿着钥匙站在门外"
  },
  "order045_door_unlock": {
    "src": "/images/items/order-045-door-unlock.png",
    "alt": "用钥匙插入门锁并转动开锁"
  },
  "order045_door_open": {
    "src": "/images/items/order-045-door-open.png",
    "alt": "孩子推开已解锁的门"
  },
  "order045_door_enter": {
    "src": "/images/items/order-045-door-enter.png",
    "alt": "孩子从打开的门走进家"
  },
  "order045_door_push": {
    "src": "/images/items/order-045-door-push.png",
    "alt": "孩子把钥匙留在手里，只推仍锁着的门，门未打开"
  },
  "order045_door_knock": {
    "src": "/images/items/order-045-door-knock.png",
    "alt": "孩子敲仍关闭的门，钥匙留在另一只手"
  },
  "order045_fish_shore": {
    "src": "/images/items/order-045-fish-shore.png",
    "alt": "小鱼在湿润岸边，尚未回到水里"
  },
  "order045_fish_return": {
    "src": "/images/items/order-045-fish-return.png",
    "alt": "在大人陪同下双手轻轻把小鱼放回紧邻的浅水中"
  },
  "order045_fish_swim": {
    "src": "/images/items/order-045-fish-swim.png",
    "alt": "同一条小鱼在小河水里自在游动"
  },
  "order045_fish_watch": {
    "src": "/images/items/order-045-fish-watch.png",
    "alt": "孩子只是蹲在岸边继续看小鱼，没有拿鱼"
  },
  "order045_fish_cup": {
    "src": "/images/items/order-045-fish-cup.png",
    "alt": "孩子拿空杯从小河舀水，小鱼仍在岸边"
  },
  "order045_plant_soil": {
    "src": "/images/items/order-045-plant-soil.png",
    "alt": "只有土的花盆，没有种子/芽/花"
  },
  "order045_plant_sow": {
    "src": "/images/items/order-045-plant-sow.png",
    "alt": "手把一粒种子放进花盆土中小洞，尚未发芽"
  },
  "order045_plant_sprout": {
    "src": "/images/items/order-045-plant-sprout.png",
    "alt": "同款花盆中小芽生长，只有两片小叶"
  },
  "order045_plant_flower": {
    "src": "/images/items/order-045-plant-flower.png",
    "alt": "同款花盆长出花朵"
  },
  "order045_plant_waterSoil": {
    "src": "/images/items/order-045-plant-waterSoil.png",
    "alt": "给只有土、没有种子的空花盆浇水"
  },
  "order045_plant_waitSoil": {
    "src": "/images/items/order-045-plant-waitSoil.png",
    "alt": "孩子坐着等只有土的花盆开花，没有播种"
  },
  "order045_plant_waterSprout": {
    "src": "/images/items/order-045-plant-waterSprout.png",
    "alt": "给现有小芽周围干燥的土浇水"
  },
  "order045_plant_pickFlower": {
    "src": "/images/items/order-045-plant-pickFlower.png",
    "alt": "孩子从已开花的花盆摘一朵花，表现摘花动作，不是浇水"
  },
  "order045_plant_waitSprout": {
    "src": "/images/items/order-045-plant-waitSprout.png",
    "alt": "孩子只是坐着看干土里的小芽，水壶放旁边未使用"
  },
  "order045_snack_dirty": {
    "src": "/images/items/order-045-snack-dirty.png",
    "alt": "孩子展示有泥的双手，饼干未碰"
  },
  "order045_snack_wash": {
    "src": "/images/items/order-045-snack-wash.png",
    "alt": "双手在水龙头清水下用肥皂洗干净，明显洗手动作"
  },
  "order045_snack_take": {
    "src": "/images/items/order-045-snack-take.png",
    "alt": "孩子用干净手拿一块饼干"
  },
  "order045_snack_eat": {
    "src": "/images/items/order-045-snack-eat.png",
    "alt": "孩子用干净手拿饼干到嘴边吃"
  },
  "order045_snack_plate": {
    "src": "/images/items/order-045-snack-plate.png",
    "alt": "孩子拿起空盘子，饼干尚未盛放"
  },
  "order045_snack_cookies": {
    "src": "/images/items/order-045-snack-cookies.png",
    "alt": "散放在干净纸垫上的几块饼干，未盛到盘子"
  },
  "order045_snack_cup": {
    "src": "/images/items/order-045-snack-cup.png",
    "alt": "孩子拿起一个空杯，饼干仍散放"
  },
  "order045_snack_pencilCase": {
    "src": "/images/items/order-045-snack-pencilCase.png",
    "alt": "孩子拿起文具盒，饼干仍散放"
  },
  "order045_snack_dirtyTake": {
    "src": "/images/items/order-045-snack-dirtyTake.png",
    "alt": "孩子用有明显泥污的手直接拿饼干，尚未洗手"
  },
  "order045_snack_dirtyEat": {
    "src": "/images/items/order-045-snack-dirtyEat.png",
    "alt": "孩子用有明显泥污的手直接把饼干送到嘴边，尚未洗手"
  },
  "order045_snack_dirtyPlate": {
    "src": "/images/items/order-045-snack-dirtyPlate.png",
    "alt": "孩子用有明显泥污的手先拿空盘子，尚未洗手"
  },
  "order045_writing_classroom": {
    "src": "/images/items/order-045-writing-classroom.png",
    "alt": "孩子坐在教室书桌，面前空白纸还未动笔"
  },
  "order045_writing_pencil": {
    "src": "/images/items/order-045-writing-pencil.png",
    "alt": "孩子拿起铅笔，旁边空白纸"
  },
  "order045_writing_write": {
    "src": "/images/items/order-045-writing-write.png",
    "alt": "孩子用铅笔在纸上画简单短线练习写字，不需要文字"
  },
  "order045_writing_book": {
    "src": "/images/items/order-045-writing-book.png",
    "alt": "孩子拿起一本闭合书本"
  },
  "order045_writing_ruler": {
    "src": "/images/items/order-045-writing-ruler.png",
    "alt": "孩子拿起尺子"
  },
  "order045_packing_book": {
    "src": "/images/items/order-045-packing-book.png",
    "alt": "一本书放在桌上，打开的空书包在旁边"
  },
  "order045_packing_bag": {
    "src": "/images/items/order-045-packing-bag.png",
    "alt": "孩子把书装入打开的书包"
  },
  "order045_packing_school": {
    "src": "/images/items/order-045-packing-school.png",
    "alt": "孩子背着装好书的书包走向校门"
  },
  "order045_packing_lunch": {
    "src": "/images/items/order-045-packing-lunch.png",
    "alt": "孩子拿打开的饭盒到书旁，书尚未放进去"
  },
  "order045_packing_bottle": {
    "src": "/images/items/order-045-packing-bottle.png",
    "alt": "孩子拿水壶到书旁，书尚未收进书包"
  },
  "order045_rain_rain": {
    "src": "/images/items/order-045-rain-rain.png",
    "alt": "窗外下雨，孩子在屋里看见雨滴"
  },
  "order045_rain_raincoat": {
    "src": "/images/items/order-045-rain-raincoat.png",
    "alt": "孩子正在穿上黄色雨衣"
  },
  "order045_rain_out": {
    "src": "/images/items/order-045-rain-out.png",
    "alt": "孩子穿好雨衣在下雨的室外走"
  },
  "order045_rain_hat": {
    "src": "/images/items/order-045-rain-hat.png",
    "alt": "孩子只戴普通遮阳帽，没有穿雨衣"
  },
  "order045_rain_ball": {
    "src": "/images/items/order-045-rain-ball.png",
    "alt": "孩子只拿足球准备出门，没有穿雨衣"
  },
  "order045_tower_fallen": {
    "src": "/images/items/order-045-tower-fallen.png",
    "alt": "积木散在地板上，孩子尚未碰它们"
  },
  "order045_tower_pick": {
    "src": "/images/items/order-045-tower-pick.png",
    "alt": "孩子弯腰把地上的积木一块块捡到低桌上"
  },
  "order045_tower_tower": {
    "src": "/images/items/order-045-tower-tower.png",
    "alt": "同一组积木在低桌上搭成高塔"
  },
  "order045_tower_build": {
    "src": "/images/items/order-045-tower-build.png",
    "alt": "孩子尝试在低桌上搭塔，但大部分积木还散在地板上"
  },
  "order045_tower_box": {
    "src": "/images/items/order-045-tower-box.png",
    "alt": "孩子把捡到的积木放进盒子，桌上没有塔"
  },
  "order045_sorting_mixed": {
    "src": "/images/items/order-045-sorting-mixed.png",
    "alt": "积木与小汽车混杂在一起，两个空盒在旁"
  },
  "order045_sorting_sort": {
    "src": "/images/items/order-045-sorting-sort.png",
    "alt": "孩子将积木与小汽车分成两堆，盒子还空着"
  },
  "order045_sorting_put": {
    "src": "/images/items/order-045-sorting-put.png",
    "alt": "孩子把积木放入积木盒、把小车放入小车盒，正在分别装盒"
  },
  "order045_sorting_done": {
    "src": "/images/items/order-045-sorting-done.png",
    "alt": "两类玩具分别整齐放在各自盒子里"
  },
  "order045_sorting_allOne": {
    "src": "/images/items/order-045-sorting-allOne.png",
    "alt": "孩子把积木和小车混装到同一个盒子，另一个空着"
  },
  "order045_sorting_one": {
    "src": "/images/items/order-045-sorting-one.png",
    "alt": "孩子只捡一个玩具放盒里，其余仍留地上"
  },
  "order045_sorting_sortAgain": {
    "src": "/images/items/order-045-sorting-sortAgain.png",
    "alt": "已经分成两堆，孩子又逐个摆动同一堆玩具，不装入旁边空盒"
  },
  "order045_sorting_sorted": {
    "src": "/images/items/order-045-sorting-sorted.png",
    "alt": "积木与小车已经分成两堆，孩子双手未操作，两个空盒在旁"
  },
  "order045_blocks_fallen": {
    "src": "/images/items/order-045-blocks-fallen.png",
    "alt": "圆柱和方块积木散在地板上，倒下的塔"
  },
  "order045_blocks_pick": {
    "src": "/images/items/order-045-blocks-pick.png",
    "alt": "孩子把地上的圆柱和方块积木捡到桌上"
  },
  "order045_blocks_sort": {
    "src": "/images/items/order-045-blocks-sort.png",
    "alt": "孩子把圆柱和方块积木按形状分成两堆"
  },
  "order045_blocks_put": {
    "src": "/images/items/order-045-blocks-put.png",
    "alt": "孩子将两类积木分开放进两个对应盒子"
  },
  "order045_blocks_done": {
    "src": "/images/items/order-045-blocks-done.png",
    "alt": "圆柱与方块积木在两个盒里分别整齐装好"
  },
  "order045_blocks_build": {
    "src": "/images/items/order-045-blocks-build.png",
    "alt": "孩子把积木搭成高塔，旁边收纳盒还空着"
  },
  "order045_blocks_mixedBox": {
    "src": "/images/items/order-045-blocks-mixedBox.png",
    "alt": "孩子将没分类的圆柱和方块混装进盒子"
  },
  "order045_traffic_junction": {
    "src": "/images/items/order-045-traffic-junction.png",
    "alt": "孩子和大人牵手站在有斑马线的路口，还在路缘后"
  },
  "order045_traffic_look": {
    "src": "/images/items/order-045-traffic-look.png",
    "alt": "孩子和大人留在路缘后，一起抬头看行人信号灯，手指向信号灯"
  },
  "order045_traffic_green": {
    "src": "/images/items/order-045-traffic-green.png",
    "alt": "行人绿灯亮，孩子和大人仍在路缘后观察车辆安全"
  },
  "order045_traffic_cross": {
    "src": "/images/items/order-045-traffic-cross.png",
    "alt": "行人绿灯亮、车辆停在停止线后，大人牵孩子走斑马线"
  },
  "order045_traffic_red": {
    "src": "/images/items/order-045-traffic-red.png",
    "alt": "清楚的红色站立小人行人信号灯，背景人仍在路缘后"
  },
  "order045_traffic_stop": {
    "src": "/images/items/order-045-traffic-stop.png",
    "alt": "行人红灯时孩子和大人停在路缘后等待，双脚未迈出"
  },
  "order045_traffic_waitOthers": {
    "src": "/images/items/order-045-traffic-waitOthers.png",
    "alt": "孩子与大人留在路缘后只看旁边其他行人，视线不看灯"
  },
  "order045_traffic_carOnly": {
    "src": "/images/items/order-045-traffic-carOnly.png",
    "alt": "孩子与大人留在路缘后只看停止线后的汽车，视线不看行人灯"
  },
  "order045_traffic_directCross": {
    "src": "/images/items/order-045-traffic-directCross.png",
    "alt": "行人灯仍红，孩子想直接迈步，大人牵住孩子使其仍未进入马路，表现过早行动的错误选择"
  },
  "order045_bridge_river": {
    "src": "/images/items/order-045-bridge-river.png",
    "alt": "桌面模型玩具兔在近岸、蓝纸小河隔开两岸，尚无桥"
  },
  "order045_bridge_build": {
    "src": "/images/items/order-045-bridge-build.png",
    "alt": "孩子把木板横跨模型小河，连接两岸，兔子仍在近岸"
  },
  "order045_bridge_cross": {
    "src": "/images/items/order-045-bridge-cross.png",
    "alt": "玩具兔沿已经搭好的木板桥走到对岸"
  },
  "order045_bridge_carrot": {
    "src": "/images/items/order-045-bridge-carrot.png",
    "alt": "玩具兔已到对岸拿到胡萝卜，木板桥仍连接两岸"
  },
  "order045_bridge_flag": {
    "src": "/images/items/order-045-bridge-flag.png",
    "alt": "玩具兔已到对岸小旗处，木板桥仍连接两岸"
  },
  "order045_bridge_water": {
    "src": "/images/items/order-045-bridge-water.png",
    "alt": "尚无桥，手把玩具兔从近岸移进蓝纸小河里"
  },
  "order045_bridge_reachCarrot": {
    "src": "/images/items/order-045-bridge-reachCarrot.png",
    "alt": "尚无桥，玩具兔留在近岸伸向够不着的对岸胡萝卜"
  },
  "order045_bridge_wait": {
    "src": "/images/items/order-045-bridge-wait.png",
    "alt": "尚无桥，玩具兔仍等在近岸，木板没有搭上"
  }
};
function story(name, captions, columns = 2, rows = 2) {
  return captions.map((alt, index) => ({ src: `/images/items/exploration-art/${name}.png`, alt, frame: { columns, rows, index }, style: "illustration" }));
}
const single = (name, alt) => story(name, [alt], 1, 1)[0];
const planting = story("planting-steps", ["取花盆", "放土和种子", "轻轻浇水", "等待发芽"]);
planting[1] = single("sowing-seed", "放土和种子");
const explorationArt = {
  catPlant: story("cat-plant-story", ["小猫收到种子", "小猫把种子种进土里", "小猫按记录照顾小苗", "小猫观察新叶片"]),
  bearTower: story("bear-tower-story", ["小熊准备木块", "小熊搭起高塔", "球碰倒了高塔", "小熊换宽底座重搭"]),
  rain: story("rain-story", ["天上积起乌云", "开始下雨", "地面留下水洼", "小朋友穿雨靴出门"]),
  plantGrowth: story("plant-growth", ["种子在土里", "先长出根", "小芽出土", "叶片展开"]),
  butterflyGrowth: story("butterfly-growth", ["毛毛虫吃叶子", "形成蛹", "蝴蝶出来", "蝴蝶展开翅膀"]),
  frogGrowth: story("frog-growth", ["水里有卵", "孵出蝌蚪", "蝌蚪长出后腿", "小青蛙尾巴变短"]),
  tools: story("everyday-tools", ["雨伞", "毛巾", "圆头剪刀", "颜料和画笔"]),
  fruitSalad: story("fruit-salad-steps", ["洗净水果", "把水果切块", "把果块装碗", "一起品尝"]),
  painting: story("painting-steps", ["准备画纸", "画出轮廓", "给画涂色", "把画晾干"]),
  planting,
  boxStates: [single("box-open", "打开的盒子"), single("box-closed", "关上的盒子")],
  experimentMaterials: story("experiment-materials", ["木块", "塑料盒", "金属勺", "一盆浅水"]),
  memoryEvents: story("memory-event-stories", ["带苹果出门", "在树下等雨停", "和小猫分苹果", "找来木板", "合作放好木板", "走过小桥"], 3, 2),
  everydayActions: story("everyday-actions", ["喝水", "画线", "擦干", "挡雨", "遮阳", "装饭", "拼搭", "阅读", "量长度"], 3, 3),
  parentMaterials: story("parent-materials", ["圆柱形积木", "方积木", "透明杯", "不透明袋", "布片", "小托盘", "手电筒", "橡皮泥", "塑料切刀"], 3, 3),
  craftMaterials: story("craft-materials", ["白纸", "彩笔", "透明彩色片", "软垫"])
};
const explorationArtImages = Object.fromEntries(Object.entries(explorationArt).flatMap(([name, frames]) => frames.map((frame, index) => [`${name}${index + 1}`, frame])));
const imageGallery = {
  characters: {
    cat: {
      src: "/images/characters/cat.png",
      alt: "小猫头像"
    },
    dog: {
      src: "/images/characters/dog.png",
      alt: "小狗头像"
    },
    rabbit: {
      src: "/images/characters/rabbit.png",
      alt: "小兔头像"
    },
    bear: {
      src: "/images/characters/bear.png",
      alt: "小熊头像"
    }
  },
  items: {
    ...logicHouseItems,
    ...orderStoryItems,
    drinkingPour: { src: "/images/items/drinking-pour.png", alt: "小朋友把水壶里的饮用水倒进桌上的杯子，水流进入杯中。" },
    openDoor: { src: "/images/items/art-052/open-door.png", alt: "已经打开的门" },
    setSquare: { src: "/images/items/art-052/set-square.png", alt: "带刻度的三角尺" },
    soilPot: { src: "/images/items/order-045-plant-soil.png", alt: "只有土，还没播种的花盆" },
    fishOnShore: { src: "/images/items/art-052/fish-on-shore.png", alt: "小鱼在岸边，水在旁边" },
    ...explorationArtImages,
    thinkingRedSquare: { src: "/images/items/thinking-symbols/red-square.png", alt: "红色方形" },
    thinkingYellowSquare: { src: "/images/items/thinking-symbols/yellow-square.png", alt: "黄色方形" },
    art052Home: { src: "/images/items/art-052/home.png", alt: "小房子" },
    art052Carrot: { src: "/images/items/art-052/carrot.png", alt: "胡萝卜" },
    art052Gift: { src: "/images/items/art-052/gift.png", alt: "礼物盒" },
    art052Seed: { src: "/images/items/art-052/seed.png", alt: "没有发芽的种子" },
    art052Puddle: { src: "/images/items/art-052/puddle.png", alt: "地上的水洼" },
    patternRedDisc: {
      src: "/images/items/pattern-train/red-disc.png",
      alt: "规律图卡红色圆片"
    },
    patternBlueDisc: {
      src: "/images/items/pattern-train/blue-disc.png",
      alt: "规律图卡蓝色圆片"
    },
    patternYellowDisc: {
      src: "/images/items/pattern-train/yellow-disc.png",
      alt: "规律图卡黄色圆片"
    },
    patternGreenDisc: {
      src: "/images/items/pattern-train/green-disc.png",
      alt: "规律图卡绿色圆片"
    },
    patternSun: {
      src: "/images/items/pattern-train/sun.png",
      alt: "规律图卡太阳"
    },
    patternMoon: {
      src: "/images/items/pattern-train/moon.png",
      alt: "规律图卡月亮"
    },
    patternStar: {
      src: "/images/items/pattern-train/star.png",
      alt: "规律图卡星星"
    },
    patternLargeDisc: {
      src: "/images/items/pattern-train/large-disc.png",
      alt: "规律图卡大圆"
    },
    patternMediumDisc: {
      src: "/images/items/pattern-train/medium-disc.png",
      alt: "规律图卡中圆"
    },
    patternSmallDisc: {
      src: "/images/items/pattern-train/small-disc.png",
      alt: "规律图卡小圆"
    },
    patternStrawberry: {
      src: "/images/items/pattern-train/strawberry.png",
      alt: "规律图卡草莓"
    },
    patternCookie: {
      src: "/images/items/pattern-train/cookie.png",
      alt: "规律图卡饼干"
    },
    patternApple: {
      src: "/images/items/pattern-train/apple.png",
      alt: "规律图卡苹果"
    },
    graphicFlower: {
      src: "/images/items/graphic-workshop/flower.png",
      alt: "图形工坊花朵贴纸"
    },
    strawberry: {
      src: "/images/items/strawberry.png",
      alt: "草莓"
    },
    apple: {
      src: "/images/items/apple.png",
      alt: "苹果"
    },
    orange: {
      src: "/images/items/orange.png",
      alt: "橘子"
    },
    grape: {
      src: "/images/items/art-052/grape.png",
      alt: "葡萄"
    },
    cookie: {
      src: "/images/items/cookie.png",
      alt: "饼干"
    },
    dirtyHands: {
      src: "/images/items/dirty-hands.png",
      alt: "沾着泥的脏手"
    },
    washHands: {
      src: "/images/items/wash-hands.png",
      alt: "在水龙头下洗手"
    },
    plate: {
      src: "/images/items/plate.png",
      alt: "空盘子"
    },
    eatCookie: {
      src: "/images/items/eat-cookie.png",
      alt: "小朋友拿着饼干准备吃"
    },
    trafficLook: {
      src: "/images/items/traffic-look.png",
      alt: "小朋友先看信号灯"
    },
    stopWait: {
      src: "/images/items/stop-wait.png",
      alt: "小朋友停下等待"
    },
    walkCrosswalk: {
      src: "/images/items/walk-crosswalk.png",
      alt: "小朋友走过斑马线"
    },
    toysMess: {
      src: "/images/items/toys-mess.png",
      alt: "散乱的玩具和积木"
    },
    sortToys: {
      src: "/images/items/sort-toys.png",
      alt: "玩具按种类分成几组"
    },
    tidyBox: {
      src: "/images/items/tidy-box.png",
      alt: "玩具收进盒子里"
    },
    river: {
      src: "/images/items/river.png",
      alt: "需要跨过的小河"
    },
    bridge: {
      src: "/images/items/bridge.png",
      alt: "搭好的木板桥"
    },
    longPlank: {
      src: "/images/items/long-plank.png",
      alt: "长木板"
    },
    shortPlank: {
      src: "/images/items/short-plank.png",
      alt: "短木板"
    },
    tinyPlank: {
      src: "/images/items/tiny-plank.png",
      alt: "太短的木板"
    },
    twoPlanks: {
      src: "/images/items/two-planks.png",
      alt: "两块木板接起来"
    },
    backpack: {
      src: "/images/items/backpack.png",
      alt: "书包"
    },
    book: {
      src: "/images/items/book.png",
      alt: "书本"
    },
    pencil: {
      src: "/images/items/pencil.png",
      alt: "铅笔"
    },
    ruler: {
      src: "/images/items/art-052/ruler.png",
      alt: "尺子"
    },
    pencilCase: {
      src: "/images/items/pencil-case.png",
      alt: "文具盒"
    },
    waterBottle: {
      src: "/images/items/water-bottle.png",
      alt: "水壶"
    },
    lunchBox: {
      src: "/images/items/lunch-box.png",
      alt: "饭盒"
    },
    raincoat: {
      src: "/images/items/raincoat.png",
      alt: "雨衣"
    },
    sunHat: {
      src: "/images/items/sun-hat.png",
      alt: "帽子"
    },
    toyCar: {
      src: "/images/items/toy-car.png",
      alt: "玩具车"
    },
    bus: {
      src: "/images/items/art-052/bus.png",
      alt: "公交车"
    },
    bike: {
      src: "/images/items/art-052/bike.png",
      alt: "自行车"
    },
    plane: {
      src: "/images/items/art-052/plane.png",
      alt: "飞机"
    },
    water: {
      src: "/images/items/water.png",
      alt: "水"
    },
    cup: {
      src: "/images/items/cup.png",
      alt: "杯子"
    },
    key: {
      src: "/images/items/key.png",
      alt: "钥匙"
    },
    door: {
      src: "/images/items/door.png",
      alt: "门"
    },
    box: {
      src: "/images/items/box.png",
      alt: "盒子"
    },
    soccer: {
      src: "/images/items/soccer.png",
      alt: "足球"
    },
    kite: {
      src: "/images/items/kite.png",
      alt: "风筝"
    },
    sky: {
      src: "/images/items/sky.png",
      alt: "天空"
    },
    cupcake: {
      src: "/images/items/cupcake.png",
      alt: "纸杯蛋糕"
    },
    child: {
      src: "/images/items/child.png",
      alt: "小朋友"
    },
    candy: {
      src: "/images/items/candy.png",
      alt: "糖果"
    },
    block: {
      src: "/images/items/block.png",
      alt: "积木"
    },
    blockTower: {
      src: "/images/items/art-052/block-tower.png",
      alt: "积木塔"
    },
    star: {
      src: "/images/items/star.png",
      alt: "星星"
    },
    fish: {
      src: "/images/items/fish.png",
      alt: "小鱼"
    },
    bird: {
      src: "/images/items/bird.png",
      alt: "小鸟"
    }
  }
};
function publicAsset(path) {
  const relativePath = path.replace(/^\/+/, "");
  return `${"/"}${relativePath}`;
}
let preferredVoice = null;
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    preferredVoice = null;
    pickVoice("zh-CN");
  };
}
function pickVoice(lang) {
  if (preferredVoice) return preferredVoice;
  const voices = window.speechSynthesis.getVoices();
  const preferredNames = ["Xiaoxiao", "Xiaoyi", "Tingting", "Meijia", "Sinji", "Li-mu", "Yu-shu"];
  preferredVoice = voices.find((voice) => preferredNames.some((name) => voice.name.includes(name))) ?? voices.find((voice) => voice.lang === lang) ?? voices.find((voice) => voice.lang.toLowerCase().startsWith("zh")) ?? null;
  return preferredVoice;
}
const tokenMap = {
  "🍓": { label: "草莓", kind: "patternStrawberry" },
  "🍪": { label: "饼干", kind: "patternCookie" },
  "⭐": { label: "星星", kind: "patternStar" },
  "🟡": { label: "黄色圆片", kind: "patternYellowDisc" },
  "🟢": { label: "绿色圆片", kind: "patternGreenDisc" },
  "🔵": { label: "蓝色圆片", kind: "patternBlueDisc" },
  "🔴": { label: "红色圆片", kind: "patternRedDisc" },
  "🟣": { label: "紫色圆片", kind: "purpleDot" },
  "⬜": { label: "空位", kind: "emptyBox" },
  "🟦": { label: "蓝色方块", kind: "blueSquare" },
  "🟥": { label: "红色方块", kind: "redSquare" },
  "🟨": { label: "黄色方块", kind: "yellowSquare" },
  "🍎": { label: "苹果", kind: "patternApple" },
  "🧁": { label: "纸杯蛋糕", kind: "cupcake" },
  "🍊": { label: "橘子", kind: "orange" },
  "🧱": { label: "积木", kind: "block" },
  "🐦": { label: "小鸟", kind: "bird" },
  "🐟": { label: "小鱼", kind: "fish" },
  "🐱": { label: "小猫", kind: "cat" },
  "😺": { label: "小橘猫", kind: "orangeCat" },
  "⚽": { label: "足球", kind: "soccer" },
  "✏": { label: "铅笔", kind: "pencil" },
  "✏️": { label: "铅笔", kind: "pencil" },
  "🍽️": { label: "盘子", kind: "plate" },
  "🍬": { label: "糖果", kind: "candy" },
  "🧒": { label: "小朋友", kind: "child" },
  "👧": { label: "小女孩", kind: "childGirl" },
  "👦": { label: "小男孩", kind: "childBoy" },
  "☀️": { label: "太阳", kind: "patternSun" },
  "🌙": { label: "月亮", kind: "patternMoon" },
  "🥤": { label: "杯子", kind: "cup" },
  "💧": { label: "水", kind: "water" },
  "🎁": { label: "魔法盒", kind: "magicBox" },
  "➡️": { label: "箭头", kind: "arrow", compact: true },
  "🐰": { label: "小兔", kind: "rabbit" },
  "🥕": { label: "胡萝卜", kind: "carrot" },
  "🐶": { label: "小狗", kind: "dog" },
  "🌱": { label: "发芽", kind: "sprout" },
  "🌼": { label: "花", kind: "flower" },
  "🏃": { label: "跑步", kind: "run" },
  "🐻": { label: "小熊", kind: "bear" },
  "🍯": { label: "蜂蜜", kind: "honey" },
  "🌊": { label: "小河", kind: "river" },
  "🏁": { label: "终点", kind: "goal" },
  "?": { label: "待补位置", kind: "missingSlot", compact: true },
  "|": { label: "竖中线", kind: "verticalFold", compact: true },
  "-": { label: "横中线", kind: "horizontalFold", compact: true },
  "⬤": { label: "大圆", kind: "patternLargeDisc" },
  "●": { label: "中圆", kind: "patternMediumDisc" },
  "•": { label: "小圆", kind: "patternSmallDisc" }
};
const phraseMap = {
  "小猫": { label: "小猫", kind: "cat" },
  "小狗": { label: "小狗", kind: "dog" },
  "小兔": { label: "小兔", kind: "rabbit" },
  "小熊": { label: "小熊", kind: "bear" },
  "小鸟": { label: "小鸟", kind: "bird" },
  "小鱼": { label: "小鱼", kind: "fish" },
  "小朋友": { label: "小朋友", kind: "child" },
  "小河": { label: "小河", kind: "river" },
  "苹果": { label: "苹果", kind: "apple" },
  "橘子": { label: "橘子", kind: "orange" },
  "草莓": { label: "草莓", kind: "strawberry" },
  "葡萄": { label: "葡萄", kind: "grape" },
  "饼干": { label: "饼干", kind: "cookie" },
  "糖果": { label: "糖果", kind: "candy" },
  "蛋糕": { label: "蛋糕", kind: "cake" },
  "杯子": { label: "杯子", kind: "cup" },
  "盘子": { label: "盘子", kind: "plate" },
  "盒子": { label: "盒子", kind: "box" },
  "小汽车": { label: "小汽车", kind: "car" },
  "玩具车": { label: "玩具车", kind: "car" },
  "小车": { label: "小车", kind: "car" },
  "积木": { label: "积木", kind: "block" },
  "公交车": { label: "公交车", kind: "bus" },
  "自行车": { label: "自行车", kind: "bike" },
  "飞机": { label: "飞机", kind: "plane" },
  "风筝": { label: "风筝", kind: "kite" },
  "铅笔": { label: "铅笔", kind: "pencil" },
  "文具盒": { label: "文具盒", kind: "pencilCase" },
  "书包": { label: "书包", kind: "backpack" },
  "尺子": { label: "尺子", kind: "ruler" },
  "三角尺": { label: "三角尺", kind: "setSquare" },
  "书本": { label: "书本", kind: "book" },
  "水壶": { label: "水壶", kind: "waterBottle" },
  "水": { label: "水", kind: "water" },
  "饭盒": { label: "饭盒", kind: "lunchBox" },
  "帽子": { label: "帽子", kind: "sunHat" },
  "雨衣": { label: "雨衣", kind: "raincoat" },
  "足球": { label: "足球", kind: "soccer" },
  "积木塔": { label: "积木塔", kind: "tower" },
  "大圆": { label: "大圆", kind: "patternLargeDisc" },
  "中圆": { label: "中圆", kind: "patternMediumDisc" },
  "小圆": { label: "小圆", kind: "patternSmallDisc" },
  "红色圆片": { label: "红色圆片", kind: "redDot" },
  "黄色圆片": { label: "黄色圆片", kind: "yellowDot" },
  "绿色圆片": { label: "绿色圆片", kind: "greenDot" },
  "蓝色圆片": { label: "蓝色圆片", kind: "blueDot" },
  "紫色圆片": { label: "紫色圆片", kind: "purpleDot" },
  "蓝色方块": { label: "蓝色方块", kind: "blueSquare" },
  "红色方块": { label: "红色方块", kind: "redSquare" },
  "黄色方块": { label: "黄色方块", kind: "yellowSquare" },
  "大星": { label: "大星", kind: "star" },
  "小星": { label: "小星", kind: "smallStar" },
  "星星": { label: "星星", kind: "star" },
  "大方块": { label: "大方块", kind: "bigSquare" },
  "小方块": { label: "小方块", kind: "smallSquare" },
  "太阳": { label: "太阳", kind: "sun" },
  "月亮": { label: "月亮", kind: "moon" },
  "天空": { label: "天空", kind: "sky" },
  "家": { label: "家", kind: "home" },
  "门": { label: "门", kind: "door" },
  "钥匙": { label: "钥匙", kind: "key" },
  "起点": { label: "起点", kind: "startFlag" },
  "终点": { label: "终点", kind: "goal" },
  "遮住了": { label: "遮住了", kind: "coveredCard" },
  "小鸟天空": { label: "小鸟和天空", kind: "birdSky" },
  "小鱼小河": { label: "小鱼和小河", kind: "fishWater" },
  "小狗家": { label: "小狗和家", kind: "dogHome" },
  "小河小狗": { label: "小河和小狗", kind: "riverDog" },
  "天空家": { label: "天空和家", kind: "skyHome" },
  "积木和小车": { label: "积木和小车", kind: "toysMess" },
  "左边": { label: "左边", kind: "leftArrow" },
  "右边": { label: "右边", kind: "rightArrow" },
  "上面": { label: "上面", kind: "upArrow" },
  "下面": { label: "下面", kind: "downArrow" },
  "绿灯": { label: "绿灯", kind: "greenDot" },
  "红灯": { label: "红灯", kind: "redDot" },
  "红色": { label: "红色", kind: "redDot" },
  "蓝色": { label: "蓝色", kind: "blueDot" },
  "绿色": { label: "绿色", kind: "greenDot" },
  "黄色": { label: "黄色", kind: "yellowDot" },
  "红色篮子": { label: "红色篮子", kind: "redDot" },
  "蓝色篮子": { label: "蓝色篮子", kind: "blueDot" },
  "绿色篮子": { label: "绿色篮子", kind: "greenDot" },
  "黄色篮子": { label: "黄色篮子", kind: "yellowDot" },
  "圆形篮子": { label: "圆形篮子", kind: "bigDot" },
  "方形篮子": { label: "方形篮子", kind: "bigSquare" },
  "按红绿灯走": { label: "按红绿灯走", kind: "normalRule" },
  "玩反口令": { label: "玩反口令", kind: "reverseRule" },
  "反着来": { label: "反着来", kind: "reverseRule" },
  "慢慢来": { label: "慢慢来", kind: "slowRule" },
  "绿灯慢慢走": { label: "绿灯慢慢走", kind: "slowRule" },
  "红灯先拍手": { label: "红灯先拍手", kind: "clap" },
  "先拍手": { label: "先拍手", kind: "clap" },
  "走": { label: "走", kind: "walk" },
  "停": { label: "停", kind: "stopSign" },
  "慢慢走": { label: "慢慢走", kind: "slowRule" },
  "拍手": { label: "拍手", kind: "clap" },
  "抱肩": { label: "抱肩", kind: "hugShoulders" },
  "摸头": { label: "摸头", kind: "touchHead" },
  "停下等": { label: "停下等", kind: "stopSign" },
  "看到门": { label: "看到门", kind: "door" },
  "门关着": { label: "门关着", kind: "door" },
  "门锁着": { label: "门锁着", kind: "door" },
  "用钥匙开锁": { label: "用钥匙开锁", kind: "key" },
  "开门": { label: "开门", kind: "openDoor" },
  "进屋": { label: "进屋", kind: "home" },
  "口渴": { label: "口渴", kind: "cup" },
  "上课": { label: "上课", kind: "book" },
  "写字": { label: "写字", kind: "pencil" },
  "去学校": { label: "去学校", kind: "backpack" },
  "下雨": { label: "下雨", kind: "raincoat" },
  "出门": { label: "出门", kind: "walk" },
  "倒水": { label: "倒水", kind: "pourWater" },
  "喝水": { label: "喝水", kind: "cup" },
  "只有土的花盆": { label: "只有土的花盆", kind: "soilPot" },
  "小鱼在岸上": { label: "小鱼在岸上", kind: "fishOnShore" },
  "小岛": { label: "小岛", kind: "stone" },
  "先拿杯子": { label: "先拿杯子", kind: "cup" },
  "先找钥匙": { label: "先找钥匙", kind: "key" },
  "先搭桥": { label: "先搭桥", kind: "bridge" },
  "种下种子": { label: "种下种子", kind: "seed" },
  "先浇水": { label: "先浇水", kind: "waterSoil" },
  "先摘花": { label: "先摘花", kind: "flower" },
  "先洗手": { label: "先洗手", kind: "washHands" },
  "少了先洗手": { label: "少了先洗手", kind: "washHands" },
  "先捡积木": { label: "先捡积木", kind: "pickBlocks" },
  "先飞回去": { label: "先飞回去", kind: "flyHome" },
  "轻轻放回水里": { label: "放回水里", kind: "fishWater" },
  "先分类": { label: "先分类", kind: "sortToys" },
  "先分开两类": { label: "先分开两类", kind: "sortTwoToys" },
  "分好的两类玩具": { label: "分好的两类玩具", kind: "sortTwoToys" },
  "取出后先分类": { label: "取出后先分类", kind: "sortTwoToys" },
  "再分类一遍": { label: "再分类一遍", kind: "sortTwoToys" },
  "只收一个玩具": { label: "只收一个玩具", kind: "car" },
  "混在一个盒子": { label: "混在一个盒子", kind: "mixedToyBox" },
  "全放同一个盒子": { label: "全放同一个盒子", kind: "mixedToyBox" },
  "继续混放": { label: "继续混放", kind: "mixedToyBox" },
  "分类装好": { label: "分类装好", kind: "classifiedToyBoxes" },
  "分开放进盒子": { label: "分开放进盒子", kind: "classifiedToyBoxes" },
  "先倒水": { label: "先倒水", kind: "pourWater" },
  "拿杯子接水": { label: "拿杯子接水", kind: "pourWater" },
  "端空杯子过去": { label: "端空杯子过去", kind: "cup" },
  "再拿一个杯子": { label: "再拿一个杯子", kind: "cup" },
  "继续看着": { label: "继续看着", kind: "notYet" },
  "只给空土浇水": { label: "只给空土浇水", kind: "waterSoil" },
  "直接等开花": { label: "直接等开花", kind: "flower" },
  "先看灯": { label: "先看灯", kind: "trafficLook" },
  "只看车停着": { label: "只看车停着", kind: "car" },
  "拿盘子": { label: "拿盘子", kind: "plate" },
  "拿饼干": { label: "拿饼干", kind: "cookie" },
  "放进盒子": { label: "放进盒子", kind: "tidyBox" },
  "先放进盒子": { label: "先放进盒子", kind: "tidyBox" },
  "先拿饼干": { label: "先拿饼干", kind: "cookie" },
  "先吃饼干": { label: "先吃饼干", kind: "eat" },
  "直接吃": { label: "直接吃", kind: "eat" },
  "先拿盘子": { label: "先拿盘子", kind: "plate" },
  "只拿盘子": { label: "只拿盘子", kind: "plate" },
  "少了拿盘子": { label: "少了拿盘子", kind: "plate" },
  "少了多拿饼干": { label: "少了多拿饼干", kind: "cookie" },
  "先拿胡萝卜": { label: "先拿胡萝卜", kind: "carrot" },
  "先搭高塔": { label: "先搭高塔", kind: "tower" },
  "直接搭高塔": { label: "直接搭高塔", kind: "tower" },
  "等红灯再走": { label: "等红灯再走", kind: "stopSign" },
  "继续等着": { label: "继续等着", kind: "slowRule" },
  "闭眼往前走": { label: "闭眼往前走", kind: "walk" },
  "站在岸边等": { label: "站在岸边等", kind: "noBridge" },
  "再洗手": { label: "再洗手", kind: "washHands" },
  "继续洗手": { label: "继续洗手", kind: "washHands" },
  "直接走进水里": { label: "直接走进水里", kind: "river" },
  "把木板接长": { label: "把木板接长", kind: "twoPlanks" },
  "继续用短木板": { label: "继续用短木板", kind: "shortPlank" },
  "换同样短木板": { label: "换同样短木板", kind: "shortPlank" },
  "重新弄乱": { label: "重新弄乱", kind: "toysMess" },
  "随便塞进盒子": { label: "随便塞进盒子", kind: "toysMess" },
  "吃": { label: "吃", kind: "eat" },
  "🧱倒了": { label: "积木倒了", kind: "fallenBlocks" },
  "高塔": { label: "高塔", kind: "tower" },
  "鸟窝": { label: "鸟窝", kind: "nest" },
  "手脏": { label: "手脏", kind: "dirtyHands" },
  "路口": { label: "路口", kind: "crosswalk" },
  "走过去": { label: "走过去", kind: "walk" },
  "直接走过去": { label: "直接走过去", kind: "walk" },
  "先走过去": { label: "先走过去", kind: "walk" },
  "玩具散了": { label: "玩具散了", kind: "toysMess" },
  "整齐": { label: "整齐", kind: "tidyBox" },
  "宽河": { label: "宽河", kind: "wideRiver" },
  "河有多宽": { label: "河有多宽", kind: "wideRiver" },
  "木板颜色": { label: "木板颜色", kind: "longPlank" },
  "小旗颜色": { label: "小旗颜色", kind: "goal" },
  "长": { label: "长木板", kind: "longPlank" },
  "短": { label: "短木板", kind: "shortPlank" },
  "太短": { label: "太短木板", kind: "tinyPlank" },
  "只能用2块": { label: "只能用两块", kind: "twoLimit" },
  "长木板": { label: "长木板", kind: "longPlank" },
  "短木板": { label: "短木板", kind: "shortPlank" },
  "太短木板": { label: "太短木板", kind: "tinyPlank" },
  "只用长木板": { label: "只用长木板", kind: "longPlank" },
  "只用短木板": { label: "只用短木板", kind: "shortPlank" },
  "用两块木板": { label: "用两块木板", kind: "twoPlanks" },
  "长 + 短": { label: "长加短", kind: "longShort" },
  "短 + 太短": { label: "短加太短", kind: "shortTiny" },
  "太短 + 太短": { label: "太短加太短", kind: "tinyTiny" },
  "小石头": { label: "小石头", kind: "stone" },
  "不搭桥": { label: "不搭桥", kind: "noBridge" },
  "都不要": { label: "都不要", kind: "none" },
  "两个都一样": { label: "两个都一样", kind: "same" },
  "都一样": { label: "都一样", kind: "same" },
  "一样多": { label: "一样多", kind: "same" },
  "左右能重合": { label: "左右能重合", kind: "verticalFold" },
  "上下能重合": { label: "上下能重合", kind: "horizontalFold" },
  "不能重合": { label: "不能重合", kind: "none" },
  "能确定": { label: "能确定", kind: "certain" },
  "还不能确定": { label: "还不能确定", kind: "notYet" },
  "证据已经够了": { label: "证据已经够了", kind: "certain" },
  "还需要更多线索": { label: "还需要更多线索", kind: "notYet" },
  "不用再看线索": { label: "不用再看线索", kind: "none" },
  "不用再找线索": { label: "不用再找线索", kind: "none" },
  "一定是小狗": { label: "一定是小狗", kind: "dog" },
  "一定是小猫": { label: "一定是小猫", kind: "cat" },
  "小猫肯定没偷吃": { label: "小猫肯定没偷吃", kind: "cleanCat" },
  "小狗肯定没弄乱": { label: "小狗肯定没弄乱", kind: "dogSleep" }
};
const clueRules = [
  [/小猫.*奶油|猫.*奶油/, { label: "小猫嘴边有奶油", kind: "catCream" }],
  [/小狗.*睡觉/, { label: "小狗在睡觉", kind: "dogSleep" }],
  [/小兔.*胡萝卜/, { label: "小兔拿着胡萝卜", kind: "rabbitCarrot" }],
  [/猫脚印/, { label: "猫脚印", kind: "pawPrints" }],
  [/小猫在厨房/, { label: "小猫在厨房", kind: "catKitchen" }],
  [/蛋糕少了一块/, { label: "蛋糕少了一块", kind: "cakeMissing" }],
  [/小狗脚上有泥/, { label: "小狗脚上有泥", kind: "dogMud" }],
  [/小猫身上很干净/, { label: "小猫很干净", kind: "cleanCat" }],
  [/倒下的杯子/, { label: "倒下的杯子", kind: "fallenCup" }],
  [/地上有水/, { label: "地上有水", kind: "waterPuddle" }],
  [/花粉/, { label: "手上有花粉", kind: "pollenPaw" }],
  [/小狗在房间里/, { label: "小狗在房间里", kind: "dogRoom" }],
  [/小鸟在窗边/, { label: "小鸟在窗边", kind: "birdSky" }]
];
const compoundParts = {
  "小鸟天空": ["小鸟", "天空"],
  "小鱼小河": ["小鱼", "小河"],
  "小狗家": ["小狗", "家"],
  "小河小狗": ["小河", "小狗"],
  "天空家": ["天空", "家"],
  "积木和小车": ["积木", "小车"]
};
function visualParts(value) {
  return compoundParts[value] ?? Array.from(value).filter((part) => part !== "️");
}
function visualMetaFor(value) {
  const exact = tokenMap[value] ?? phraseMap[value];
  if (exact) return exact;
  return clueRules.find(([pattern]) => pattern.test(value))?.[1] ?? null;
}
function VisualGlyph({ kind, small = false }) {
  return /* @__PURE__ */ jsx(Illustration, { kind, small });
}
function Illustration({ kind, small = false }) {
  const raster = rasterForKind(kind);
  if (raster) {
    return /* @__PURE__ */ jsx("img", { className: `kid-illustration kid-avatar ${small ? "small" : ""}`, "data-visual-kind": kind, style: kind === "smallStar" ? { transform: "scale(0.55)" } : void 0, src: publicAsset(raster.src), alt: "", "aria-hidden": "true" });
  }
  return /* @__PURE__ */ jsxs("svg", { className: `kid-illustration ${small ? "small" : ""}`, "data-visual-kind": kind, viewBox: "0 0 96 96", role: "img", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx(CrayonTexture, {}),
    draw(kind)
  ] });
}
function rasterForKind(kind) {
  const refined = {
    home: imageGallery.items.art052Home,
    magicBox: imageGallery.items.art052Gift,
    carrot: imageGallery.items.art052Carrot,
    seed: imageGallery.items.art052Seed,
    waterPuddle: imageGallery.items.art052Puddle,
    sun: imageGallery.items.patternSun,
    moon: imageGallery.items.patternMoon,
    sprout: orderStoryItems.order045_plant_sprout,
    flower: imageGallery.items.graphicFlower,
    pickBlocks: orderStoryItems.order045_tower_pick,
    fallenBlocks: orderStoryItems.order045_tower_fallen,
    fishWater: orderStoryItems.order045_fish_swim,
    pourWater: imageGallery.items.drinkingPour,
    waterSoil: orderStoryItems.order045_plant_waterSoil,
    catCream: imageGallery.items.logic046Evidence_cakeCat,
    dogSleep: imageGallery.items.logic046Evidence_cakeDog,
    rabbitCarrot: imageGallery.items.logic046Evidence_cakeRabbit,
    catKitchen: imageGallery.items.logic046Evidence_weakCatContext,
    dogMud: imageGallery.items.logic046Evidence_mudDog,
    cleanCat: imageGallery.characters.cat,
    fallenCup: imageGallery.items.logic046Evidence_spillCup,
    pollenPaw: imageGallery.items.logic046Evidence_flowerPollen,
    dogRoom: imageGallery.items.logic046Evidence_weakDogContext,
    stone: imageGallery.items.logic046Daily_stone,
    mixedToyBox: orderStoryItems.order045_blocks_mixedBox,
    classifiedToyBoxes: orderStoryItems.order045_sorting_done,
    sortTwoToys: orderStoryItems.order045_sorting_sorted
  };
  if (refined[kind]) return refined[kind];
  if (kind === "redSquare") return imageGallery.items.thinkingRedSquare;
  if (kind === "yellowSquare") return imageGallery.items.thinkingYellowSquare;
  if (kind === "soilPot") return imageGallery.items.soilPot;
  if (kind === "clap") return imageGallery.items.logic046Daily_clap;
  if (kind === "hugShoulders") return imageGallery.items.logic046Daily_hugShoulders;
  if (kind === "touchHead") return imageGallery.items.logic046Daily_touchHead;
  if (kind === "fishOnShore") return imageGallery.items.fishOnShore;
  if (kind === "patternRedDisc") return imageGallery.items.patternRedDisc;
  if (kind === "patternBlueDisc") return imageGallery.items.patternBlueDisc;
  if (kind === "patternYellowDisc") return imageGallery.items.patternYellowDisc;
  if (kind === "patternGreenDisc") return imageGallery.items.patternGreenDisc;
  if (kind === "patternSun") return imageGallery.items.patternSun;
  if (kind === "patternMoon") return imageGallery.items.patternMoon;
  if (kind === "patternStar") return imageGallery.items.patternStar;
  if (kind === "patternLargeDisc") return imageGallery.items.patternLargeDisc;
  if (kind === "patternMediumDisc") return imageGallery.items.patternMediumDisc;
  if (kind === "patternSmallDisc") return imageGallery.items.patternSmallDisc;
  if (kind === "patternStrawberry") return imageGallery.items.patternStrawberry;
  if (kind === "patternCookie") return imageGallery.items.patternCookie;
  if (kind === "patternApple") return imageGallery.items.patternApple;
  if (kind === "cat" || kind === "orangeCat") return imageGallery.characters.cat;
  if (kind === "dog") return imageGallery.characters.dog;
  if (kind === "rabbit") return imageGallery.characters.rabbit;
  if (kind === "bear") return imageGallery.characters.bear;
  if (kind === "strawberry") return imageGallery.items.strawberry;
  if (kind === "apple") return imageGallery.items.apple;
  if (kind === "orange") return imageGallery.items.orange;
  if (kind === "grape") return imageGallery.items.grape;
  if (kind === "cookie") return imageGallery.items.cookie;
  if (kind === "dirtyHands") return imageGallery.items.dirtyHands;
  if (kind === "washHands") return imageGallery.items.washHands;
  if (kind === "plate") return imageGallery.items.plate;
  if (kind === "eat") return imageGallery.items.eatCookie;
  if (kind === "trafficLook") return imageGallery.items.trafficLook;
  if (kind === "stopSign") return imageGallery.items.stopWait;
  if (kind === "walk") return imageGallery.items.walkCrosswalk;
  if (kind === "toysMess") return imageGallery.items.toysMess;
  if (kind === "sortToys") return imageGallery.items.sortToys;
  if (kind === "tidyBox") return imageGallery.items.tidyBox;
  if (kind === "river" || kind === "wideRiver") return imageGallery.items.river;
  if (kind === "bridge") return imageGallery.items.bridge;
  if (kind === "longPlank") return imageGallery.items.longPlank;
  if (kind === "shortPlank") return imageGallery.items.shortPlank;
  if (kind === "tinyPlank") return imageGallery.items.tinyPlank;
  if (kind === "twoPlanks") return imageGallery.items.twoPlanks;
  if (kind === "backpack") return imageGallery.items.backpack;
  if (kind === "book") return imageGallery.items.book;
  if (kind === "pencil") return imageGallery.items.pencil;
  if (kind === "ruler") return imageGallery.items.ruler;
  if (kind === "setSquare") return imageGallery.items.setSquare;
  if (kind === "pencilCase") return imageGallery.items.pencilCase;
  if (kind === "waterBottle") return imageGallery.items.waterBottle;
  if (kind === "lunchBox") return imageGallery.items.lunchBox;
  if (kind === "raincoat") return imageGallery.items.raincoat;
  if (kind === "sunHat") return imageGallery.items.sunHat;
  if (kind === "car") return imageGallery.items.toyCar;
  if (kind === "bus") return imageGallery.items.bus;
  if (kind === "bike") return imageGallery.items.bike;
  if (kind === "plane") return imageGallery.items.plane;
  if (kind === "water") return imageGallery.items.water;
  if (kind === "cup") return imageGallery.items.cup;
  if (kind === "key") return imageGallery.items.key;
  if (kind === "door") return imageGallery.items.door;
  if (kind === "openDoor") return imageGallery.items.openDoor;
  if (kind === "box") return imageGallery.items.box;
  if (kind === "soccer") return imageGallery.items.soccer;
  if (kind === "kite") return imageGallery.items.kite;
  if (kind === "sky") return imageGallery.items.sky;
  if (kind === "cupcake" || kind === "cake" || kind === "cakeMissing") return imageGallery.items.cupcake;
  if (kind === "child" || kind === "childGirl" || kind === "childBoy") return imageGallery.items.child;
  if (kind === "candy") return imageGallery.items.candy;
  if (kind === "block") return imageGallery.items.block;
  if (kind === "tower") return imageGallery.items.blockTower;
  if (kind === "star" || kind === "smallStar") return imageGallery.items.star;
  if (kind === "fish") return imageGallery.items.fish;
  if (kind === "bird") return imageGallery.items.bird;
  return null;
}
function CrayonTexture() {
  return /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("filter", { id: "crayonNoise", x: "-10%", y: "-10%", width: "120%", height: "120%", children: [
    /* @__PURE__ */ jsx("feTurbulence", { type: "fractalNoise", baseFrequency: "0.9", numOctaves: "2", seed: "4", result: "noise" }),
    /* @__PURE__ */ jsx("feDisplacementMap", { in: "SourceGraphic", in2: "noise", scale: "0.8" })
  ] }) });
}
function drawPair(first, second) {
  return [first, second].map((kind, index) => {
    const raster = rasterForKind(kind);
    return /* @__PURE__ */ jsx("svg", { x: index * 48, y: "22", width: "48", height: "48", viewBox: "0 0 96 96", children: raster ? /* @__PURE__ */ jsx("image", { href: publicAsset(raster.src), width: "96", height: "96" }) : draw(kind) }, `${kind}-${index}`);
  });
}
function draw(kind) {
  switch (kind) {
    case "strawberry":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-red", d: "M48 82C29 67 20 50 26 36c6-13 19-10 22-3 4-7 17-10 22 3 7 14-3 31-22 46Z" }),
        /* @__PURE__ */ jsx("path", { className: "fill-leaf", d: "M36 28l6-12 6 11 8-11 3 14-12 5Z" }),
        /* @__PURE__ */ jsx("circle", { cx: "40", cy: "50", r: "2" }),
        /* @__PURE__ */ jsx("circle", { cx: "53", cy: "57", r: "2" }),
        /* @__PURE__ */ jsx("circle", { cx: "47", cy: "43", r: "2" })
      ] });
    case "apple":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-red", d: "M48 80c-20 0-28-17-25-33 3-17 18-20 25-10 7-10 22-7 25 10 3 16-5 33-25 33Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-leaf", d: "M50 29c8-13 17-11 22-9-7 8-14 12-22 9Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M48 35c1-8 2-12 6-17" })
      ] });
    case "orange":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-orange", cx: "48", cy: "51", r: "28" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-leaf", d: "M47 25c7-10 16-8 21-4-7 5-13 7-21 4Z" })
      ] });
    case "cookie":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-cookie", cx: "48", cy: "50", r: "29" }),
        /* @__PURE__ */ jsx("circle", { cx: "39", cy: "43", r: "3" }),
        /* @__PURE__ */ jsx("circle", { cx: "57", cy: "49", r: "3" }),
        /* @__PURE__ */ jsx("circle", { cx: "47", cy: "62", r: "3" })
      ] });
    case "cupcake":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-pink", d: "M24 44c2-15 16-23 24-11 9-12 24-4 24 11Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-gold", d: "M29 45h38l-5 33H34Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M38 51l2 22M48 51v23M58 51l-2 22" })
      ] });
    case "star":
      return /* @__PURE__ */ jsx("path", { className: "stroke fill-gold", d: "M48 14l10 22 24 3-18 16 5 24-21-12-21 12 5-24-18-16 24-3Z" });
    case "block":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-coral", d: "M24 34h44v36H24Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-gold", d: "M34 24h44v36H68V34H34Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M68 34l10-10M68 70l10-10" })
      ] });
    case "fish":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-sky", d: "M22 50c16-21 39-21 52 0-13 21-36 21-52 0Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-blue", d: "M72 50l14-14v28Z" }),
        /* @__PURE__ */ jsx("circle", { cx: "38", cy: "45", r: "3" })
      ] });
    case "bird":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-sky", d: "M25 53c4-18 25-27 42-12 14 13 4 35-19 35-15 0-26-8-23-23Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-gold", d: "M66 45l16 7-16 7Z" }),
        /* @__PURE__ */ jsx("circle", { cx: "46", cy: "43", r: "3" })
      ] });
    case "cat":
    case "orangeCat":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: `stroke ${kind === "cat" ? "fill-gold" : "fill-orange"}`, d: "M24 72V35l10-17 14 15 14-15 10 17v37Z" }),
        /* @__PURE__ */ jsx("circle", { cx: "40", cy: "49", r: "3" }),
        /* @__PURE__ */ jsx("circle", { cx: "58", cy: "49", r: "3" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M44 60c3 3 6 3 9 0M48 53l-4 4h8Z" })
      ] });
    case "plate":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("ellipse", { className: "stroke fill-white", cx: "48", cy: "52", rx: "34", ry: "22" }),
        /* @__PURE__ */ jsx("ellipse", { className: "stroke fill-sky-soft", cx: "48", cy: "52", rx: "22", ry: "11" })
      ] });
    case "candy":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-pink", d: "M30 38h36v20H30Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-coral", d: "M30 48L12 34v28Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-coral", d: "M66 48l18-14v28Z" })
      ] });
    case "grape":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-purple", cx: "39", cy: "36", r: "10" }),
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-purple", cx: "55", cy: "36", r: "10" }),
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-purple", cx: "31", cy: "52", r: "10" }),
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-purple", cx: "48", cy: "52", r: "10" }),
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-purple", cx: "64", cy: "52", r: "10" }),
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-purple", cx: "41", cy: "68", r: "10" }),
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-purple", cx: "57", cy: "68", r: "10" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-leaf", d: "M49 25c8-12 17-10 23-5-7 6-14 8-23 5Z" })
      ] });
    case "cake":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-pink", d: "M22 42c4-14 17-22 29-17 11 4 21 13 23 29H22Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-gold", d: "M27 53h42l-5 25H32Z" }),
        /* @__PURE__ */ jsx("circle", { className: "fill-red", cx: "52", cy: "29", r: "5" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M36 61h23" })
      ] });
    case "car":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-coral", d: "M18 54h60v20H18Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-sky-soft", d: "M31 38h29l10 16H24Z" }),
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-ink", cx: "32", cy: "75", r: "7" }),
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-ink", cx: "64", cy: "75", r: "7" })
      ] });
    case "bus":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("rect", { className: "stroke fill-gold", x: "17", y: "31", width: "62", height: "42", rx: "8" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-sky-soft", d: "M26 40h14v15H26Zm21 0h14v15H47Z" }),
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-ink", cx: "31", cy: "74", r: "6" }),
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-ink", cx: "65", cy: "74", r: "6" })
      ] });
    case "bike":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-white", cx: "27", cy: "67", r: "15" }),
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-white", cx: "69", cy: "67", r: "15" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M27 67l16-24h16l10 24M43 43l8 24H27m24 0l18-24M48 31h15M39 31h-9" })
      ] });
    case "plane":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-sky", d: "M12 52l72-27-18 27 18 27Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-blue", d: "M36 54L22 75l28-11M36 50L22 29l28 11" })
      ] });
    case "kite":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-coral", d: "M48 13l25 28-25 36-25-36Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M48 13v64M23 41h50M48 77c-5 6-9 10-13 13" })
      ] });
    case "pencil":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-gold", d: "M24 68l38-43 12 12-38 43Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-pink", d: "M62 25l7-8 12 12-7 8Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-brown", d: "M24 68l-6 16 18-4Z" })
      ] });
    case "pencilCase":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("rect", { className: "stroke fill-blue", x: "17", y: "33", width: "62", height: "34", rx: "10" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-gold", d: "M25 45h46" }),
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-white", cx: "69", cy: "45", r: "4" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-pink", d: "M30 57h24" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-white", d: "M37 33v34" })
      ] });
    case "backpack":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-coral", d: "M28 35c1-16 39-16 40 0v43H28Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-sky-soft", d: "M37 51h22v22H37Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M36 34c2-11 22-11 24 0M28 46H17M68 46h11" })
      ] });
    case "waterBottle":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-blue", d: "M36 29h24l5 13v37H31V42Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-sky-soft", d: "M39 16h18v13H39Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-white", d: "M38 50h20v17H38Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-blue", d: "M48 52c6 8 9 12 9 17 0 5-4 9-9 9s-9-4-9-9c0-5 3-9 9-17Z" })
      ] });
    case "lunchBox":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("rect", { className: "stroke fill-leaf", x: "20", y: "38", width: "56", height: "35", rx: "9" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-sky-soft", d: "M26 31h44v15H26Z" }),
        /* @__PURE__ */ jsx("rect", { className: "stroke fill-orange", x: "39", y: "50", width: "18", height: "10", rx: "3" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M32 38c2-8 30-8 32 0" })
      ] });
    case "sunHat":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-blue", d: "M20 66c8-10 48-10 56 0 4 5-3 10-28 10S16 71 20 66Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-sky", d: "M30 61c2-20 34-20 36 0Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-gold", d: "M31 61h34v8H31Z" })
      ] });
    case "raincoat":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-gold", d: "M28 82V38c5-17 35-17 40 0v44Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-yellow", d: "M36 39c3-13 21-13 24 0Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M48 40v42M37 59h8M55 59h8" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-gold", d: "M28 43L15 59l12 8M68 43l13 16-12 8" })
      ] });
    case "ruler":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-gold", d: "M17 63l51-42 11 13-51 42Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M33 57l-5-6M44 48l-4-6M55 39l-5-6M66 30l-4-6" })
      ] });
    case "setSquare":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-leaf", d: "M20 76h56L20 20Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-white", d: "M35 63h20L35 43Z" })
      ] });
    case "book":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-blue", d: "M18 27h29c8 0 12 5 12 12v42c0-7-4-11-12-11H18Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-leaf", d: "M78 27H59c-8 0-12 5-12 12v42c0-7 4-11 12-11h19Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M48 33v46" })
      ] });
    case "soccer":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-white", cx: "48", cy: "48", r: "31" }),
        /* @__PURE__ */ jsx("path", { className: "fill-ink", d: "M48 31l13 9-5 15H40l-5-15Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M35 40l-14-2M61 40l14-2M40 55l-9 14M56 55l9 14" })
      ] });
    case "smallStar":
      return /* @__PURE__ */ jsx("path", { className: "stroke fill-gold", d: "M48 25l7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2Z" });
    case "bigSquare":
      return /* @__PURE__ */ jsx("rect", { className: "stroke fill-blue", x: "20", y: "20", width: "56", height: "56", rx: "8" });
    case "smallSquare":
      return /* @__PURE__ */ jsx("rect", { className: "stroke fill-blue", x: "32", y: "32", width: "32", height: "32", rx: "7" });
    case "sky":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-gold", cx: "62", cy: "31", r: "13" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-sky-soft", d: "M24 57c6-13 23-14 30-3 10-8 26-4 29 10H18c0-4 2-6 6-7Z" })
      ] });
    case "home":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-coral", d: "M20 43l28-25 28 25v35H20Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-brown", d: "M37 78V55h22v23" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-sky-soft", d: "M25 43h46" })
      ] });
    case "birdSky":
      return drawPair("bird", "sky");
    case "dogHome":
      return drawPair("dog", "home");
    case "riverDog":
      return drawPair("river", "dog");
    case "skyHome":
      return drawPair("sky", "home");
    case "child":
    case "childGirl":
    case "childBoy":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-skin", cx: "48", cy: "31", r: "15" }),
        /* @__PURE__ */ jsx("path", { className: `stroke ${kind === "childGirl" ? "fill-pink" : kind === "childBoy" ? "fill-blue" : "fill-leaf"}`, d: "M28 82c2-22 11-34 20-34s18 12 20 34Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M39 31h1M56 31h1M42 39c4 4 8 4 12 0" })
      ] });
    case "sun":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-gold", cx: "48", cy: "48", r: "21" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M48 10v14M48 72v14M10 48h14M72 48h14M21 21l10 10M65 65l10 10M75 21L65 31M31 65L21 75" })
      ] });
    case "moon":
      return /* @__PURE__ */ jsx("path", { className: "stroke fill-moon", d: "M61 18c-20 6-31 22-27 40 4 17 19 26 36 21-9 8-22 11-35 6-18-8-27-28-19-46 8-19 27-27 45-21Z" });
    case "cup":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-sky", d: "M27 29h38l-5 44H32Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M65 39h9c8 0 8 15 0 15h-9" })
      ] });
    case "water":
      return /* @__PURE__ */ jsx("path", { className: "stroke fill-blue", d: "M48 14c17 23 25 36 25 48 0 14-11 24-25 24S23 76 23 62c0-12 8-25 25-48Z" });
    case "magicBox":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-gold", d: "M22 39h52v37H22Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-coral", d: "M18 28h60v15H18Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-white", d: "M43 28h10v48H43Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M30 22c-10-12 20-16 18 6M66 22c10-12-20-16-18 6" })
      ] });
    case "box":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-gold", d: "M20 39h56v38H20Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-cookie", d: "M28 27h40l8 12H20Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M48 39v38M20 39l8-12M76 39l-8-12" })
      ] });
    case "arrow":
      return /* @__PURE__ */ jsx("path", { className: "stroke fill-leaf", d: "M16 40h42V24l24 24-24 24V56H16Z" });
    case "leftArrow":
      return /* @__PURE__ */ jsx("path", { className: "stroke fill-leaf", d: "M80 40H38V24L14 48l24 24V56h42Z" });
    case "rightArrow":
      return /* @__PURE__ */ jsx("path", { className: "stroke fill-leaf", d: "M16 40h42V24l24 24-24 24V56H16Z" });
    case "upArrow":
      return /* @__PURE__ */ jsx("path", { className: "stroke fill-leaf", d: "M40 82V40H24l24-24 24 24H56v42Z" });
    case "downArrow":
      return /* @__PURE__ */ jsx("path", { className: "stroke fill-leaf", d: "M40 14v42H24l24 24 24-24H56V14Z" });
    case "rabbit":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("ellipse", { className: "stroke fill-white", cx: "37", cy: "27", rx: "8", ry: "22", transform: "rotate(-12 37 27)" }),
        /* @__PURE__ */ jsx("ellipse", { className: "stroke fill-white", cx: "59", cy: "27", rx: "8", ry: "22", transform: "rotate(12 59 27)" }),
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-white", cx: "48", cy: "56", r: "27" }),
        /* @__PURE__ */ jsx("circle", { cx: "39", cy: "52", r: "3" }),
        /* @__PURE__ */ jsx("circle", { cx: "57", cy: "52", r: "3" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M45 61l3 3 3-3M48 64v6" })
      ] });
    case "carrot":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-orange", d: "M44 84L28 32h40L52 84Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-leaf", d: "M48 32C37 21 30 17 23 16c8 10 13 15 25 16Zm1 0c10-13 18-18 27-17-7 12-14 17-27 17Z" })
      ] });
    case "dog":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-cookie", d: "M25 37c7-23 39-23 46 0v38H25Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-brown", d: "M25 37L11 51c1 13 13 14 18 5ZM71 37l14 14c-1 13-13 14-18 5Z" }),
        /* @__PURE__ */ jsx("circle", { cx: "40", cy: "51", r: "3" }),
        /* @__PURE__ */ jsx("circle", { cx: "57", cy: "51", r: "3" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M47 57l-4 5h9Z" })
      ] });
    case "sprout":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M48 82V39" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-leaf", d: "M48 48C28 45 23 29 24 20c15 2 24 10 24 28Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-leaf", d: "M49 47c20-2 27-16 26-27-15 2-26 10-26 27Z" })
      ] });
    case "flower":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M48 82V55" }),
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-gold", cx: "48", cy: "42", r: "9" }),
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-pink", cx: "48", cy: "21", r: "12" }),
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-pink", cx: "67", cy: "42", r: "12" }),
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-pink", cx: "48", cy: "63", r: "12" }),
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-pink", cx: "29", cy: "42", r: "12" })
      ] });
    case "run":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-skin", cx: "48", cy: "22", r: "12" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-blue", d: "M41 36l19 8-12 17-19-9Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M38 52L22 68M54 58l15 16M57 44l20-6M39 41L22 34" })
      ] });
    case "bear":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-brown", cx: "30", cy: "29", r: "11" }),
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-brown", cx: "66", cy: "29", r: "11" }),
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-cookie", cx: "48", cy: "53", r: "31" }),
        /* @__PURE__ */ jsx("circle", { cx: "38", cy: "48", r: "3" }),
        /* @__PURE__ */ jsx("circle", { cx: "58", cy: "48", r: "3" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-white", d: "M39 58c5-5 13-5 18 0-2 8-16 8-18 0Z" })
      ] });
    case "honey":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-gold", d: "M29 34h38l-5 42H34Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-yellow", d: "M34 27h28v12H34Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M39 48h18" })
      ] });
    case "river":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-sky", d: "M10 37c17-16 31 16 48 0 10-9 19-5 28 2v24c-17-15-31 16-48 0-11-10-20-5-28 2Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M17 50c15-8 23 9 36 0 8-5 16-4 25 1" })
      ] });
    case "goal":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M30 84V18" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-white", d: "M30 18h42v36H30Z" }),
        /* @__PURE__ */ jsx("path", { className: "fill-ink", d: "M30 18h14v12H30Zm28 0h14v12H58ZM44 30h14v12H44ZM30 42h14v12H30Zm28 0h14v12H58Z" })
      ] });
    case "startFlag":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M28 84V18" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-leaf", d: "M28 18h44l-8 15 8 15H28Z" }),
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-gold", cx: "29", cy: "84", r: "6" })
      ] });
    case "normalRule":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("rect", { className: "stroke fill-white", x: "21", y: "18", width: "54", height: "60", rx: "10" }),
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-leaf", cx: "48", cy: "38", r: "12" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M35 61h26M42 52l6 8 9-14" })
      ] });
    case "reverseRule":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-purple", d: "M27 32h31V20l20 20-20 20V47H27Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-coral", d: "M69 66H38v10L18 56l20-20v13h31Z" })
      ] });
    case "slowRule":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-leaf", cx: "48", cy: "56", r: "25" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-sky-soft", d: "M30 56c2-15 13-25 31-27 6 7 8 16 7 27Z" }),
        /* @__PURE__ */ jsx("circle", { cx: "57", cy: "44", r: "3" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M18 76h60M23 21l10 8M48 14v14M73 21l-10 8" })
      ] });
    case "clap":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-skin", d: "M27 64l10-35c4-8 15-4 13 5l-6 25Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-skin", d: "M69 64L59 29c-4-8-15-4-13 5l6 25Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M18 28l10 8M78 28l-10 8M48 13v12" })
      ] });
    case "walk":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-skin", cx: "47", cy: "22", r: "11" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-leaf", d: "M39 36h18l5 26H34Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M39 61L27 78M56 61l14 16M36 42l-15 9M60 43l16 7" })
      ] });
    case "stopSign":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-red", d: "M34 16h28l18 18v28L62 80H34L16 62V34Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-white", d: "M31 48h34" })
      ] });
    case "door":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-brown", d: "M27 18h42v64H27Z" }),
        /* @__PURE__ */ jsx("circle", { className: "fill-gold", cx: "59", cy: "51", r: "4" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-sky-soft", d: "M34 26h18v19H34Z" })
      ] });
    case "openDoor":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-sky-soft", d: "M24 19h45v64H24Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-brown", d: "M36 25l35-9v64l-35-8Z" }),
        /* @__PURE__ */ jsx("circle", { className: "fill-gold", cx: "61", cy: "51", r: "4" })
      ] });
    case "key":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-gold", cx: "31", cy: "47", r: "15" }),
        /* @__PURE__ */ jsx("circle", { className: "fill-white", cx: "31", cy: "47", r: "6" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-gold", d: "M44 47h36v10H68v9H57v-9H44Z" })
      ] });
    case "bridge":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-sky", d: "M10 59c16-10 25 8 38 0 14-8 24 9 38-1v20H10Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-cookie", d: "M16 48h64v12H16Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M28 48v12M48 48v12M68 48v12" })
      ] });
    case "seed":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("ellipse", { className: "stroke fill-brown", cx: "48", cy: "59", rx: "19", ry: "25", transform: "rotate(20 48 59)" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-leaf", d: "M48 39c-11-10-17-16-25-17 5 12 13 18 25 17Z" })
      ] });
    case "washHands":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-skin", d: "M24 63c8-19 14-29 24-29 13 0 20 10 25 29Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-blue", d: "M61 15c12 15 18 24 18 32 0 9-7 16-18 16s-18-7-18-16c0-8 6-17 18-32Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M25 76h48" })
      ] });
    case "pickBlocks":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("rect", { className: "stroke fill-blue", x: "19", y: "54", width: "22", height: "22", rx: "4" }),
        /* @__PURE__ */ jsx("rect", { className: "stroke fill-coral", x: "52", y: "49", width: "24", height: "24", rx: "4" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-skin", d: "M30 30c10 5 18 11 24 20l-9 9c-6-9-13-16-22-21Z" })
      ] });
    case "flyHome":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-sky", d: "M18 47c17-19 34-17 48-2 12 13 4 29-16 29-17 0-29-8-32-27Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-gold", d: "M65 46l16 7-16 7Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-brown", d: "M22 80c12-18 40-18 52 0Z" })
      ] });
    case "fishWater":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-sky", d: "M10 60c17-13 30 11 45 0 12-8 22-4 31 1v18H10Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-blue", d: "M22 39c14-15 32-15 43 0-11 16-29 16-43 0Z" }),
        /* @__PURE__ */ jsx("circle", { cx: "35", cy: "36", r: "3" })
      ] });
    case "sortToys":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("rect", { className: "stroke fill-white", x: "21", y: "45", width: "54", height: "32", rx: "6" }),
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-red", cx: "32", cy: "34", r: "9" }),
        /* @__PURE__ */ jsx("rect", { className: "stroke fill-blue", x: "47", y: "25", width: "17", height: "17", rx: "4" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-gold", d: "M67 27l8 16H59Z" })
      ] });
    case "pourWater":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-sky", d: "M20 50h32l-4 28H24Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-blue", d: "M66 18c11 13 16 21 16 28 0 8-6 13-16 13s-16-5-16-13c0-7 5-15 16-28Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M52 41l-15 14" })
      ] });
    case "trafficLook":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("rect", { className: "stroke fill-ink", x: "34", y: "13", width: "28", height: "58", rx: "8" }),
        /* @__PURE__ */ jsx("circle", { className: "fill-red", cx: "48", cy: "28", r: "7" }),
        /* @__PURE__ */ jsx("circle", { className: "fill-gold", cx: "48", cy: "43", r: "7" }),
        /* @__PURE__ */ jsx("circle", { className: "fill-leaf", cx: "48", cy: "58", r: "7" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M20 80h56" })
      ] });
    case "eat":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-skin", cx: "48", cy: "42", r: "24" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M38 42h1M58 42h1M38 56c8 6 15 6 22 0" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-cookie", d: "M64 66c9-2 17 4 17 13H52c0-7 5-12 12-13Z" })
      ] });
    case "fallenBlocks":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("rect", { className: "stroke fill-blue", x: "18", y: "60", width: "22", height: "22", rx: "4", transform: "rotate(-12 29 71)" }),
        /* @__PURE__ */ jsx("rect", { className: "stroke fill-gold", x: "42", y: "54", width: "22", height: "22", rx: "4", transform: "rotate(16 53 65)" }),
        /* @__PURE__ */ jsx("rect", { className: "stroke fill-coral", x: "60", y: "37", width: "22", height: "22", rx: "4", transform: "rotate(31 71 48)" })
      ] });
    case "tower":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("rect", { className: "stroke fill-blue", x: "35", y: "62", width: "26", height: "18", rx: "4" }),
        /* @__PURE__ */ jsx("rect", { className: "stroke fill-gold", x: "35", y: "42", width: "26", height: "18", rx: "4" }),
        /* @__PURE__ */ jsx("rect", { className: "stroke fill-coral", x: "35", y: "22", width: "26", height: "18", rx: "4" })
      ] });
    case "nest":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-brown", d: "M23 63c8-19 42-19 50 0 0 13-50 13-50 0Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M26 64c15-8 29 7 45-1M31 56c12 6 23-8 34 0" }),
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-sky-soft", cx: "44", cy: "48", r: "8" }),
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-sky-soft", cx: "56", cy: "48", r: "8" })
      ] });
    case "dirtyHands":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-skin", d: "M27 70c5-23 13-37 24-37s18 14 22 37Z" }),
        /* @__PURE__ */ jsx("circle", { className: "fill-brown", cx: "40", cy: "56", r: "4" }),
        /* @__PURE__ */ jsx("circle", { className: "fill-brown", cx: "55", cy: "48", r: "4" }),
        /* @__PURE__ */ jsx("circle", { className: "fill-brown", cx: "60", cy: "65", r: "3" })
      ] });
    case "crosswalk":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-ink", d: "M18 19h60v60H18Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-white", d: "M25 30h46M25 45h46M25 60h46" })
      ] });
    case "toysMess":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-red", cx: "30", cy: "38", r: "10" }),
        /* @__PURE__ */ jsx("rect", { className: "stroke fill-blue", x: "54", y: "29", width: "20", height: "20", rx: "4", transform: "rotate(20 64 39)" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-gold", d: "M45 63l10 18H35Z" }),
        /* @__PURE__ */ jsx("rect", { className: "stroke fill-leaf", x: "19", y: "66", width: "18", height: "14", rx: "4" })
      ] });
    case "tidyBox":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("rect", { className: "stroke fill-white", x: "21", y: "37", width: "54", height: "37", rx: "6" }),
        /* @__PURE__ */ jsx("rect", { className: "stroke fill-blue", x: "30", y: "24", width: "16", height: "16", rx: "3" }),
        /* @__PURE__ */ jsx("rect", { className: "stroke fill-coral", x: "51", y: "24", width: "16", height: "16", rx: "3" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M28 54h40" })
      ] });
    case "sortTwoToys":
      return /* @__PURE__ */ jsx(Fragment, { children: [imageGallery.items.block, imageGallery.items.toyCar].map((item, index) => /* @__PURE__ */ jsxs("g", { transform: `translate(${index * 47} 0)`, children: [
        /* @__PURE__ */ jsx("rect", { x: "2", y: "20", width: "43", height: "58", rx: "12", fill: "#fff9e8", stroke: "#b8aa90", strokeWidth: "2", strokeDasharray: "4 3" }),
        /* @__PURE__ */ jsx("image", { href: publicAsset(item.src), x: "4", y: "27", width: "39", height: "44" })
      ] }, item.src)) });
    case "mixedToyBox":
      return /* @__PURE__ */ jsxs("g", { "data-storage-box": "mixed", children: [
        /* @__PURE__ */ jsx("path", { d: "M8 31h80v53H8Z", fill: "#ead3a8", stroke: "#9c774a", strokeWidth: "3", strokeLinejoin: "round" }),
        /* @__PURE__ */ jsx("image", { href: publicAsset(imageGallery.items.block.src), x: "12", y: "13", width: "44", height: "43" }),
        /* @__PURE__ */ jsx("image", { href: publicAsset(imageGallery.items.toyCar.src), x: "41", y: "24", width: "45", height: "36" }),
        /* @__PURE__ */ jsx("path", { d: "M8 60h80v24H8Z", fill: "#ead3a8", stroke: "#9c774a", strokeWidth: "3", strokeLinejoin: "round" })
      ] });
    case "classifiedToyBoxes":
      return /* @__PURE__ */ jsx(Fragment, { children: [imageGallery.items.block, imageGallery.items.toyCar].map((item, index) => /* @__PURE__ */ jsxs("g", { "data-storage-box": "classified", transform: `translate(${index * 47} 0)`, children: [
        /* @__PURE__ */ jsx("path", { d: "M4 45h40v39H4Z", fill: "#ead3a8", stroke: "#9c774a", strokeWidth: "3", strokeLinejoin: "round" }),
        /* @__PURE__ */ jsx("image", { href: publicAsset(item.src), x: "6", y: "13", width: "36", height: "42" }),
        /* @__PURE__ */ jsx("path", { d: "M4 54h40v30H4Z", fill: "#ead3a8", stroke: "#9c774a", strokeWidth: "3", strokeLinejoin: "round" }),
        /* @__PURE__ */ jsx("image", { href: publicAsset(item.src), x: "15", y: "60", width: "18", height: "18" })
      ] }, item.src)) });
    case "wideRiver":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-sky", d: "M5 25c18-13 32 13 50 0 13-9 24-4 36 4v43c-18-14-32 14-50 0-13-9-25-4-36 4Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M12 45c18-10 30 9 45 0 10-6 19-5 29 1" })
      ] });
    case "longPlank":
      return /* @__PURE__ */ jsx("path", { className: "stroke fill-cookie", d: "M13 43h70v17H13Z" });
    case "shortPlank":
      return /* @__PURE__ */ jsx("path", { className: "stroke fill-cookie", d: "M26 43h44v17H26Z" });
    case "tinyPlank":
      return /* @__PURE__ */ jsx("path", { className: "stroke fill-cookie", d: "M36 43h24v17H36Z" });
    case "twoLimit":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-cookie", d: "M18 36h60v11H18Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-cookie", d: "M18 56h60v11H18Z" }),
        /* @__PURE__ */ jsx("text", { x: "48", y: "32", textAnchor: "middle", className: "svg-mini-number", children: "2" })
      ] });
    case "twoPlanks":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-cookie", d: "M13 36h45v12H13Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-cookie", d: "M38 52h45v12H38Z" })
      ] });
    case "longShort":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-cookie", d: "M10 34h72v13H10Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-gold", d: "M28 55h45v13H28Z" })
      ] });
    case "shortTiny":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-cookie", d: "M20 36h45v13H20Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-gold", d: "M51 55h25v13H51Z" })
      ] });
    case "tinyTiny":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-cookie", d: "M26 36h25v13H26Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-gold", d: "M47 55h25v13H47Z" })
      ] });
    case "stone":
      return /* @__PURE__ */ jsx("path", { className: "stroke fill-sky-soft", d: "M24 68c3-20 16-32 34-28 14 3 24 12 22 28Z" });
    case "noBridge":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-sky", d: "M11 49c17-12 28 11 42 0 12-9 22-4 32 2v25H11Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-red", d: "M24 21l48 52M72 21L24 73" })
      ] });
    case "none":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-white", cx: "48", cy: "48", r: "31" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-red", d: "M27 27l42 42" })
      ] });
    case "same":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-gold", cx: "35", cy: "48", r: "18" }),
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-gold", cx: "61", cy: "48", r: "18" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M24 78h48" })
      ] });
    case "certain":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-leaf", cx: "48", cy: "48", r: "31" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-white", d: "M31 49l12 13 23-27" })
      ] });
    case "notYet":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-gold", cx: "48", cy: "48", r: "31" }),
        /* @__PURE__ */ jsx("text", { x: "48", y: "64", textAnchor: "middle", className: "svg-question", children: "?" })
      ] });
    case "catCream":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-gold", d: "M24 72V35l10-17 14 15 14-15 10 17v37Z" }),
        /* @__PURE__ */ jsx("circle", { cx: "40", cy: "49", r: "3" }),
        /* @__PURE__ */ jsx("circle", { cx: "58", cy: "49", r: "3" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-white", d: "M38 61c7 7 17 7 24 0-3 13-21 13-24 0Z" })
      ] });
    case "dogSleep":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-cookie", d: "M22 59c8-18 38-19 52 0v17H22Z" }),
        /* @__PURE__ */ jsx("circle", { cx: "41", cy: "57", r: "3" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M54 55h12M66 27h14l-14 16h14" })
      ] });
    case "rabbitCarrot":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-white", cx: "38", cy: "52", r: "24" }),
        /* @__PURE__ */ jsx("ellipse", { className: "stroke fill-white", cx: "29", cy: "24", rx: "7", ry: "18", transform: "rotate(-12 29 24)" }),
        /* @__PURE__ */ jsx("ellipse", { className: "stroke fill-white", cx: "47", cy: "24", rx: "7", ry: "18", transform: "rotate(12 47 24)" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-orange", d: "M63 79L52 43h28L69 79Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-leaf", d: "M66 43c-8-8-14-11-20-12 5 8 11 12 20 12Z" })
      ] });
    case "pawPrints":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("circle", { className: "fill-brown", cx: "34", cy: "52", r: "8" }),
        /* @__PURE__ */ jsx("circle", { className: "fill-brown", cx: "25", cy: "39", r: "4" }),
        /* @__PURE__ */ jsx("circle", { className: "fill-brown", cx: "34", cy: "35", r: "4" }),
        /* @__PURE__ */ jsx("circle", { className: "fill-brown", cx: "43", cy: "39", r: "4" }),
        /* @__PURE__ */ jsx("circle", { className: "fill-brown", cx: "62", cy: "62", r: "8" }),
        /* @__PURE__ */ jsx("circle", { className: "fill-brown", cx: "53", cy: "49", r: "4" }),
        /* @__PURE__ */ jsx("circle", { className: "fill-brown", cx: "62", cy: "45", r: "4" }),
        /* @__PURE__ */ jsx("circle", { className: "fill-brown", cx: "71", cy: "49", r: "4" })
      ] });
    case "catKitchen":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-sky-soft", d: "M18 26h60v50H18Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-gold", d: "M31 70V44l7-10 10 9 10-9 7 10v26Z" })
      ] });
    case "cakeMissing":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-pink", d: "M23 55c3-18 16-29 32-24 10 3 18 12 18 24Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-gold", d: "M27 55h42l-6 23H33Z" }),
        /* @__PURE__ */ jsx("path", { className: "fill-white", d: "M58 32c9 5 13 11 14 21-8-1-16-6-19-15Z" })
      ] });
    case "dogMud":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-cookie", d: "M25 37c7-23 39-23 46 0v38H25Z" }),
        /* @__PURE__ */ jsx("circle", { cx: "40", cy: "51", r: "3" }),
        /* @__PURE__ */ jsx("circle", { cx: "57", cy: "51", r: "3" }),
        /* @__PURE__ */ jsx("circle", { className: "fill-brown", cx: "35", cy: "75", r: "5" }),
        /* @__PURE__ */ jsx("circle", { className: "fill-brown", cx: "60", cy: "75", r: "5" })
      ] });
    case "cleanCat":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-gold", d: "M24 72V35l10-17 14 15 14-15 10 17v37Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-white", d: "M29 26l-8-8M69 26l8-8M48 18V8" }),
        /* @__PURE__ */ jsx("circle", { cx: "40", cy: "49", r: "3" }),
        /* @__PURE__ */ jsx("circle", { cx: "58", cy: "49", r: "3" })
      ] });
    case "fallenCup":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-sky", d: "M31 34l34 11-12 36-34-11Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-blue", d: "M55 67c10 2 18 5 24 11H42c2-6 6-10 13-11Z" })
      ] });
    case "waterPuddle":
      return /* @__PURE__ */ jsx("path", { className: "stroke fill-blue", d: "M17 65c10-17 20-16 29-7 8-12 23-13 33 5 7 14-6 24-31 24-23 0-38-8-31-22Z" });
    case "pollenPaw":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-gold", cx: "34", cy: "47", r: "10" }),
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-gold", cx: "62", cy: "47", r: "10" }),
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-pink", cx: "48", cy: "30", r: "8" }),
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-pink", cx: "65", cy: "30", r: "8" }),
        /* @__PURE__ */ jsx("circle", { className: "stroke fill-pink", cx: "31", cy: "30", r: "8" }),
        /* @__PURE__ */ jsx("circle", { className: "fill-brown", cx: "48", cy: "67", r: "7" })
      ] });
    case "dogRoom":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke fill-sky-soft", d: "M17 28h62v49H17Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-cookie", d: "M29 45c6-16 33-16 39 0v24H29Z" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M17 28l31-18 31 18" })
      ] });
    case "redDot":
      return /* @__PURE__ */ jsx("circle", { className: "stroke fill-red", cx: "48", cy: "48", r: "27" });
    case "yellowDot":
      return /* @__PURE__ */ jsx("circle", { className: "stroke fill-gold", cx: "48", cy: "48", r: "27" });
    case "greenDot":
      return /* @__PURE__ */ jsx("circle", { className: "stroke fill-leaf", cx: "48", cy: "48", r: "27" });
    case "blueDot":
      return /* @__PURE__ */ jsx("circle", { className: "stroke fill-blue", cx: "48", cy: "48", r: "27" });
    case "purpleDot":
      return /* @__PURE__ */ jsx("circle", { className: "stroke fill-purple", cx: "48", cy: "48", r: "27" });
    case "bigDot":
      return /* @__PURE__ */ jsx("circle", { className: "stroke fill-purple", cx: "48", cy: "48", r: "29" });
    case "mediumDot":
      return /* @__PURE__ */ jsx("circle", { className: "stroke fill-purple", cx: "48", cy: "48", r: "22" });
    case "smallDot":
      return /* @__PURE__ */ jsx("circle", { className: "stroke fill-purple", cx: "48", cy: "48", r: "16" });
    case "blueSquare":
      return /* @__PURE__ */ jsx("rect", { className: "stroke fill-blue", x: "23", y: "23", width: "50", height: "50", rx: "8" });
    case "emptyBox":
      return /* @__PURE__ */ jsx("rect", { className: "stroke fill-white", x: "24", y: "24", width: "48", height: "48", rx: "8", strokeDasharray: "7 6" });
    case "missingSlot":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("rect", { className: "stroke fill-white", x: "23", y: "23", width: "50", height: "50", rx: "9", strokeDasharray: "7 6" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-gold", d: "M35 48h26M48 35v26" })
      ] });
    case "coveredCard":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("rect", { className: "stroke fill-sky-soft", x: "22", y: "20", width: "52", height: "58", rx: "10" }),
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M31 35h34M31 48h34M31 61h22" })
      ] });
    case "verticalFold":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M48 13v70", strokeDasharray: "7 7" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-sky-soft", d: "M32 25l16-12 16 12M32 71l16 12 16-12" })
      ] });
    case "horizontalFold":
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { className: "stroke", d: "M13 48h70", strokeDasharray: "7 7" }),
        /* @__PURE__ */ jsx("path", { className: "stroke fill-sky-soft", d: "M25 32L13 48l12 16M71 32l12 16-12 16" })
      ] });
    default:
      return /* @__PURE__ */ jsx("circle", { className: "stroke fill-sky", cx: "48", cy: "48", r: "26" });
  }
}
const renderGlyph = (kind) => renderToStaticMarkup(/* @__PURE__ */ jsx(VisualGlyph, { kind }));
export {
  renderGlyph,
  visualMetaFor,
  visualParts
};
