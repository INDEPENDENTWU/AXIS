import {buildAxis811Atlas} from './learning-atlas-811.mjs';
import {buildAxis811Multilingual} from './multilingual-atlas-811.mjs';

export const AXIS812_VERSION='8.12';
export const AXIS812_LEVELS=['A1','A2','B1','B2','C1','C1+'];
export const AXIS812_LANGS=['en','ja','ko','zh'];
export const AXIS812_TURNS={short:4,full:8,immersive:12};

const L=(en,ja,ko,zh)=>({en,ja,ko,zh});
const A=(...rows)=>rows;

export const AXIS812_CONTEXTS={
 meaning:A(
  L('after six','6時以降','6시 이후','六点以后'),L('before the meeting starts','会議が始まる前','회의 시작 전','会议开始前'),L('the first option, not the first item','最初の項目ではなく、最初の選択肢','첫 항목이 아니라 첫 번째 선택지','第一个选项，不是第一项'),L('the version we agreed on yesterday','昨日合意した版','어제 합의한 버전','昨天确认的那个版本'),L('somewhere within a five-minute walk','歩いて5分以内のどこか','걸어서 5분 안쪽 어딘가','步行五分钟以内的地方'),L('a little less, not almost none','ほとんどゼロではなく、少し少なめ','거의 없는 게 아니라 조금 덜','少一点，不是几乎不要'),
 ),
 timing:A(
  L('before we leave','出る前に','나가기 전에','出发前'),L('when you have a second','少し手が空いたときに','잠깐 시간 될 때','你有空的时候'),L('after this set','このセットが終わったら','이 세트 끝나고','这组结束后'),L('before lunch','昼前に','점심 전에','午饭前'),L('once things calm down','落ち着いてから','좀 한가해지면','等忙完一点'),L('sometime today if possible','できれば今日中に','가능하면 오늘 중으로','方便的话今天之内'),
 ),
 constraint:A(
  L('I need to be out by seven','7時までには出ないといけません','7시 전에는 나가야 해요','我七点前得走'),L('I can move things around a bit','少しなら予定を動かせます','일정은 조금 조정할 수 있어요','我可以稍微调整一下'),L('tomorrow is much easier for me','明日のほうがかなり都合がいいです','저는 내일이 훨씬 편해요','我明天方便得多'),L('I only need about twenty minutes','20分くらいあれば十分です','20분 정도면 돼요','我只需要二十分钟左右'),L('I do not want to rush it','急いで済ませたくはありません','급하게 하고 싶지는 않아요','我不想赶着弄完'),L('I can wait if now is awkward','今が難しければ待てます','지금 애매하면 기다려도 돼요','现在不方便的话我可以等'),
 ),
 resolution:A(
  L('take another look at it','もう一度見てもらう','다시 한번 봐','再看一下'),L('swap it for the right one','正しいものに替えてもらう','맞는 걸로 바꿔','换成正确的那个'),L('check what happened','何が起きたか確認してもらう','무슨 일이 있었는지 확인해','查一下发生了什么'),L('fix it without resetting everything','全部リセットせずに直してもらう','전부 초기화하지 말고 고쳐','别全部重置，直接修好'),L('give me the simplest next step','次に何をすればいいか一番簡単な形で教えてもらう','다음에 뭘 하면 되는지 가장 간단하게 알려줘','告诉我最简单的下一步'),L('confirm the final amount first','最終金額を先に確認してもらう','최종 금액부터 확인해','先确认最终金额'),
 ),
 detail:A(
  L('it was busier than I expected','思ったより忙しかったです','생각보다 훨씬 바빴어요','比我想的忙多了'),L('the best part happened right at the end','一番よかったのは最後でした','제일 좋았던 건 마지막이었어요','最好玩的反而在最后'),L('I nearly changed my mind','途中でやめようかと思いました','중간에 마음을 바꿀 뻔했어요','我中途差点改主意'),L('someone there gave me a really useful tip','そこでかなり役立つことを教えてもらいました','거기서 누가 정말 유용한 팁을 알려줬어요','有人在那里给了我一个特别实用的建议'),L('I would do it differently next time','次はやり方を変えると思います','다음엔 좀 다르게 할 것 같아요','下次我会换一种做法'),L('it turned out much better than it sounded','聞いていたよりずっとよかったです','듣던 것보다 훨씬 괜찮았어요','实际比听起来好多了'),
 ),
 condition:A(
  L('I know about it beforehand','事前に分かっていれば大丈夫です','미리 알면 괜찮아요','提前告诉我就可以'),L('it does not become the default','それが当たり前にならなければ大丈夫です','그게 당연한 일이 되지만 않으면 괜찮아요','只要别变成默认做法'),L('we keep the original plan as a fallback','元の案を予備として残すなら大丈夫です','원래 계획을 백업으로 남겨 두면 괜찮아요','保留原方案作为备用就行'),L('I can still say no without making it awkward','断っても気まずくならないなら大丈夫です','제가 거절해도 어색해지지 않으면 괜찮아요','我拒绝也不会尴尬就行'),L('we decide it together','一緒に決めるなら大丈夫です','같이 정하는 거면 괜찮아요','一起决定就可以'),L('there is a clear end point','終わりがはっきりしていれば大丈夫です','끝나는 지점이 분명하면 괜찮아요','有明确的结束点就行'),
 ),
 reason:A(
  L('it saves time without lowering the quality','質を落とさず時間を節約できるからです','퀄리티를 낮추지 않고 시간을 아낄 수 있어서예요','能省时间，又不牺牲质量'),L('people react differently when the choice feels reversible','やり直せる選択だと感じると反応が変わるからです','되돌릴 수 있는 선택이라고 느끼면 반응이 달라지기 때문이에요','当选择看起来可逆时，人们的反应会不同'),L('the short-term benefit can hide a larger cost','短期的な利点が大きなコストを隠すことがあるからです','단기적인 이점이 더 큰 비용을 가릴 수 있기 때문이에요','短期好处可能掩盖更大的代价'),L('the context matters more than the headline number','見出しの数字より文脈のほうが重要だからです','표면적인 숫자보다 맥락이 더 중요하기 때문이에요','背景比表面的数字更重要'),L('it changes what people are actually optimizing for','人が本当に最適化しようとするもの自体が変わるからです','사람들이 실제로 최적화하려는 대상 자체가 달라지기 때문이에요','它会改变人们真正想优化的东西'),L('the effect is uneven across different groups','影響が集団ごとに均等ではないからです','집단마다 영향이 고르게 나타나지 않기 때문이에요','影响在不同群体之间并不均匀'),
 ),
 outcome:A(
  L('we ended up changing the plan anyway','結局、予定を変えることになりました','결국 계획을 바꾸게 됐어요','结果我们还是改了计划'),L('it solved the problem faster than expected','思ったより早く問題が解決しました','생각보다 빨리 문제가 해결됐어요','问题比预想中解决得更快'),L('nobody noticed until much later','かなり後になるまで誰も気づきませんでした','한참 뒤까지 아무도 몰랐어요','过了很久才有人发现'),L('that turned into the most useful part','それが一番役立つ部分になりました','그게 오히려 가장 유용한 부분이 됐어요','那反而成了最有用的一部分'),L('we had to start over from a cleaner point','もっと整理されたところからやり直すことになりました','더 깔끔한 지점에서 다시 시작해야 했어요','我们只好从更清晰的地方重新开始'),L('it made the next decision much easier','次の判断がかなり楽になりました','그 덕분에 다음 결정을 훨씬 쉽게 했어요','这让下一步决定容易多了'),
 )
};

export const AXIS812_FAMILIES=[
 {id:'say-what',kind:'clarify',track:'daily',b:'meaning',scenario:'听懂对方真正指什么',intent:'澄清而不打断气氛',a:A(L('later','あとで','나중에','晚点'),L('early','早め','일찍','早点'),L('the first one','最初のほう','첫 번째 거','第一个'),L('the final version','最終版','최종 버전','最终版'),L('around there','そのあたり','그쯤','差不多那里'),L('a bit','少し','조금','一点'),L('the regular one','いつものほう','평소 거','平时那个'),L('done','終わった','끝났어요','弄好了'))},
 {id:'quick-request',kind:'request',track:'daily',b:'timing',scenario:'日常里开口请人帮一个小忙',intent:'提出请求但不给人压力',a:A(L('check this for me','ここだけ見て','이것만 봐','帮我看一下这个'),L('send me the link','リンクを送って','링크를 보내','把链接发我'),L('hold this for a second','ちょっとこれを持って','이것 좀 잠깐 들어','帮我拿一下这个'),L('remind me about it','それを一度知らせて','그거 한 번 알려','提醒我一下'),L('move this over a little','これを少しずらして','이걸 조금 옮겨','把这个挪一点'),L('take a quick photo','写真を一枚撮って','사진 한 장만 찍어','帮我拍一张'),L('look up the address','住所を確認して','주소를 확인해','查一下地址'),L('save me a spot','場所を取っておいて','자리 하나 잡아','帮我留个位子'))},
 {id:'make-a-time',kind:'coordinate',track:'daily',b:'constraint',scenario:'把时间和现实限制说清楚',intent:'协商时间而不是只说行不行',a:A(L('after work','仕事のあと','퇴근 후','下班以后'),L('tomorrow morning','明日の朝','내일 아침','明天早上'),L('around six','6時ごろ','6시쯤','六点左右'),L('right after lunch','昼食のすぐあと','점심 먹고 바로','午饭刚结束'),L('later this evening','今夜もう少し遅く','오늘 저녁 조금 늦게','今晚晚一点'),L('before the rush starts','混む前','붐비기 전에','高峰开始前'),L('the first half of Saturday','土曜の前半','토요일 오전 쪽','周六前半天'),L('whenever you are already nearby','近くにいるついでで','근처에 올 때','你本来就在附近的时候'))},
 {id:'fix-the-thing',kind:'service',track:'service',b:'resolution',scenario:'遇到错误时把问题和想要的解决方案说清楚',intent:'处理问题而不是只抱怨',a:A(L('order','注文','주문','订单'),L('bill','請求','결제 금액','账单'),L('booking','予約','예약','预订'),L('delivery','配送','배송','配送'),L('account','アカウント','계정','账号'),L('size','サイズ','사이즈','尺码'),L('seat','席','좌석','座位'),L('confirmation','確認内容','확인 내용','确认信息'))},
 {id:'keep-it-going',kind:'social',track:'social',b:'detail',scenario:'让闲聊自然继续，而不是问完就停',intent:'用细节把对话接下去',a:A(L('your weekend','週末','주말','你的周末'),L('the new place','新しい店','새로 생긴 곳','那家新店'),L('your trip','旅行','여행','你的旅行'),L('that class','あのクラス','그 수업','那节课'),L('the event','イベント','행사','那个活动'),L('your new routine','新しい習慣','새 루틴','你最近的新安排'),L('the project','プロジェクト','프로젝트','那个项目'),L('your move','引っ越し','이사','你搬家的事'))},
 {id:'invite-with-room',kind:'coordinate',track:'social',b:'constraint',scenario:'邀请别人同时给对方退出空间',intent:'发出邀请但不制造社交压力',a:A(L('coffee after this','このあとコーヒー','이따 커피','结束后喝杯咖啡'),L('a quick walk','少し散歩','잠깐 산책','走一会儿'),L('dinner sometime this week','今週どこかで夕食','이번 주에 저녁','这周找天吃饭'),L('the thing on Saturday','土曜の集まり','토요일 모임','周六那个活动'),L('a short call later','あとで短く電話','이따 짧게 통화','晚点打个短电话'),L('one more round','もう一回','한 번 더','再来一轮'),L('checking out that new place','新しい店に行くこと','새로 생긴 곳 가보기','去看看那家新店'),L('joining us for a bit','少しだけ一緒に来ること','잠깐 같이 있기','过来待一会儿'))},
 {id:'clean-boundary',kind:'boundary',track:'social',b:'condition',scenario:'拒绝、设界限，但不把气氛弄僵',intent:'把边界说清楚，同时保留关系',a:A(L('changing the time a little','時間を少し変えること','시간을 조금 바꾸는 것','稍微改一下时间'),L('asking me at short notice','直前に頼まれること','갑자기 부탁받는 것','临时来问我'),L('sharing the draft early','下書きを早めに共有すること','초안을 일찍 공유하는 것','提前分享草稿'),L('keeping it casual','気軽な感じにすること','가볍게 하는 것','保持随意一点'),L('trying a different approach','別のやり方を試すこと','다른 방식을 해보는 것','换一种做法'),L('doing one extra round','もう一回だけやること','한 번 더 하는 것','多做一轮'),L('talking about it directly','直接話すこと','직접 이야기하는 것','直接谈这件事'),L('leaving it open for now','今は保留にすること','일단 열어 두는 것','暂时先不定'))},
 {id:'repair-it',kind:'repair',track:'social',b:'resolution',scenario:'说错、理解错之后自然修正',intent:'快速修正，不把小错误变成大尴尬',a:A(L('the time','時間','시간','时间'),L('your name','名前','이름','你的名字'),L('which version you meant','どの版のことか','어느 버전인지','你说的是哪个版本'),L('where we were meeting','待ち合わせ場所','어디서 만나는지','我们在哪见'),L('what you were asking','質問の意図','무슨 질문인지','你刚才问的意思'),L('who was coming','誰が来るのか','누가 오는지','谁会来'),L('the order of the steps','手順の順番','순서','步骤顺序'),L('the number you said','言った数字','말한 숫자','你刚才说的数字'))},
 {id:'travel-window',kind:'coordinate',track:'travel',b:'constraint',scenario:'旅行中围绕时间、路线和现实条件做决定',intent:'把旅行选择说得可执行',a:A(L('the earlier train','一本早い電車','더 이른 기차','更早那班车'),L('the direct route','直行ルート','직행 경로','直达路线'),L('the airport bus','空港バス','공항버스','机场巴士'),L('a taxi from here','ここからタクシー','여기서 택시','从这里打车'),L('the place near the station','駅の近くの店','역 근처 그곳','车站附近那家'),L('the later checkout','遅めのチェックアウト','늦은 체크아웃','晚一点退房'),L('the morning slot','朝の時間帯','오전 시간대','上午那个时段'),L('the route through downtown','中心部を通るルート','시내로 가는 길','经过市中心那条路'))},
 {id:'travel-fix',kind:'service',track:'travel',b:'resolution',scenario:'旅途中遇到订票、房间、行李等问题',intent:'快速拿到下一步，不被服务流程拖走',a:A(L('ticket','チケット','티켓','票'),L('room','部屋','객실','房间'),L('luggage tag','荷物タグ','수하물 태그','行李牌'),L('boarding pass','搭乗券','탑승권','登机牌'),L('reservation name','予約名','예약 이름','预订姓名'),L('pickup point','受け取り場所','픽업 장소','接送点'),L('departure time','出発時刻','출발 시간','出发时间'),L('seat assignment','座席指定','좌석 배정','座位安排'))},
 {id:'gym-request',kind:'request',track:'gym',b:'timing',scenario:'健身房里自然开口确认、轮换或请人帮忙',intent:'短、清楚、不打断训练节奏',a:A(L('spot me for this set','このセットだけ補助して','이 세트만 보조해','这一组帮我保护一下'),L('check my setup','セットアップを見て','세팅을 봐','帮我看一下我的设置'),L('let me work in','交互に使わせて','번갈아 쓰게 해','让我轮着用'),L('show me that adjustment','その調整方法を見せて','그 조절 방법을 보여','给我看一下怎么调'),L('watch one rep','一回だけフォームを見て','한 번만 자세를 봐','帮我看一下一个动作'),L('move the bench a little','ベンチを少し動かして','벤치를 조금 옮겨','把凳子挪一点'),L('tell me when you are done','終わったら教えて','끝나면 알려','你用完告诉我'),L('take this side','こっち側を持って','이쪽을 들어','帮我扶这一边'))},
 {id:'gym-coordinate',kind:'coordinate',track:'gym',b:'constraint',scenario:'训练里协商器械、组间和顺序',intent:'把训练安排说得简短又自然',a:A(L('one more set here','ここでもう1セット','여기서 한 세트 더','这里再做一组'),L('the cable station next','次にケーブル','다음에 케이블','下一项用绳索'),L('a two-minute rest','2分休憩','2분 휴식','休息两分钟'),L('the lighter pair first','先に軽いほう','가벼운 걸 먼저','先用轻一点的'),L('the last rack','最後のラック','마지막 랙','最后那个架子'),L('the next open bench','次に空くベンチ','다음 빈 벤치','下一个空凳'),L('a shorter finisher','短めの仕上げ','짧은 마무리','短一点的收尾'),L('the same weight again','同じ重量でもう一度','같은 무게로 한 번 더','同样重量再来一次'))},
 {id:'work-request',kind:'request',track:'work',b:'timing',scenario:'工作中请求确认、反馈或一个明确动作',intent:'请求具体，不制造模糊任务',a:A(L('review this section','この部分を確認して','이 부분을 검토해','看一下这一段'),L('send the latest file','最新版を送って','최신 파일을 보내','发最新文件'),L('flag anything risky','リスクがある点を教えて','위험한 부분을 표시해','把有风险的地方标出来'),L('confirm the owner','担当者を確認して','담당자를 확인해','确认一下负责人'),L('add the missing number','抜けている数字を入れて','빠진 숫자를 넣어','补上缺的数字'),L('check the deadline','締切を確認して','마감일을 확인해','确认截止时间'),L('summarize the decision','決定事項をまとめて','결정 사항을 정리해','把决定总结一下'),L('hold the change for now','今は変更を止めて','변경을 잠시 보류해','先别改这个'))},
 {id:'work-coordinate',kind:'coordinate',track:'work',b:'constraint',scenario:'把工作计划、依赖和时间窗口对齐',intent:'先对齐约束，再承诺时间',a:A(L('the draft by Wednesday','水曜までに下書き','수요일까지 초안','周三前出草稿'),L('a ten-minute check-in','10分だけ確認','10분 체크인','十分钟确认一下'),L('the smaller scope first','先に小さい範囲','작은 범위부터','先做小范围'),L('the final review tomorrow','最終確認は明日','최종 검토는 내일','明天做最终检查'),L('one owner for the handoff','引き継ぎ担当を一人にすること','인계 담당 한 명','交接只留一个负责人'),L('the data before the slides','スライドより先にデータ','슬라이드보다 데이터 먼저','先数据后幻灯片'),L('a quiet hour for deep work','集中作業の1時間','집중 작업 한 시간','留一小时不被打扰'),L('the decision before we build','作る前に判断を決めること','만들기 전에 결정','先决定再开始做'))},
 {id:'real-opinion',kind:'opinion',track:'native',b:'reason',scenario:'表达有分寸的真实观点，不只会“I think”',intent:'给观点加范围、条件和真正的理由',a:A(L('convenience is often overvalued','便利さは過大評価されがちです','편리함은 종종 과대평가돼요','便利经常被高估'),L('more choice does not always make decisions easier','選択肢が多いほど決めやすいとは限りません','선택지가 많다고 결정이 쉬워지는 건 아니에요','选择更多不一定更好决定'),L('speed is not the same as efficiency','速さと効率は同じではありません','속도가 곧 효율은 아니에요','速度不等于效率'),L('small friction can sometimes improve behavior','小さな手間が行動を改善することもあります','작은 불편이 오히려 행동을 개선할 때가 있어요','一点摩擦有时反而能改善行为'),L('the simplest metric can distort the goal','単純すぎる指標は目標をゆがめることがあります','가장 단순한 지표가 목표를 왜곡할 수 있어요','最简单的指标可能会扭曲目标'),L('people notice losses more than quiet gains','人は目立たない利益より損失に気づきやすいです','사람들은 조용한 이득보다 손실을 더 크게 느껴요','人们往往更容易注意损失，而不是不显眼的收益'),L('good defaults matter more than endless settings','無数の設定項目より良い初期値のほうが重要です','끝없는 설정값보다 좋은 기본값이 더 중요해요','好的默认值比无穷设置更重要'),L('a flexible plan can be more disciplined than a rigid one','柔軟な計画のほうが硬直した計画より規律的なこともあります','유연한 계획이 딱딱한 계획보다 더 규칙적일 수 있어요','灵活的计划有时反而比僵硬计划更有纪律'))},
 {id:'tell-a-story',kind:'story',track:'native',b:'outcome',scenario:'把一件小事讲得像真人在说，而不是报流水账',intent:'用转折和结果把故事讲完整',a:A(L('I took the wrong exit','出口を間違えました','출구를 잘못 나갔어요','我走错了出口'),L('I nearly left my bag behind','バッグを置き忘れそうになりました','가방을 두고 갈 뻔했어요','我差点把包落下'),L('we showed up way too early','かなり早く着きすぎました','너무 일찍 도착했어요','我们到得太早了'),L('the machine stopped halfway through','機械が途中で止まりました','기계가 중간에 멈췄어요','机器做到一半停了'),L('I sent the wrong file','間違ったファイルを送りました','파일을 잘못 보냈어요','我发错文件了'),L('someone recognized me from before','以前会った人に気づかれました','누가 예전에 본 적 있다고 알아봤어요','有人认出以前见过我'),L('the place was nothing like the photos','その場所は写真と全然違いました','사진이랑 완전히 달랐어요','那个地方和照片完全不一样'),L('we changed the plan at the last minute','直前に予定を変えました','마지막 순간에 계획을 바꿨어요','我们临时改了计划'))},
 {id:'ielts-claim',kind:'opinion',track:'ielts',b:'reason',scenario:'IELTS 里把观点说出边界、机制和保留',intent:'不是堆高级词，而是把论证做完整',a:A(L('governments should be cautious about measuring success with a single indicator','政府は単一の指標だけで成果を測ることに慎重であるべきです','정부는 하나의 지표로 성과를 측정하는 데 신중해야 해요','政府应谨慎用单一指标衡量成功'),L('remote work can improve productivity without benefiting every worker equally','リモートワークは生産性を高めても、すべての労働者に同じ利益をもたらすとは限りません','재택근무가 생산성을 높여도 모든 근로자에게 똑같이 이롭지는 않아요','远程办公可以提高生产率，但并不会让所有员工同等受益'),L('public transport policy should focus on reliability before prestige projects','公共交通政策は象徴的な大型事業より先に信頼性を重視すべきです','대중교통 정책은 상징적인 사업보다 신뢰성을 먼저 봐야 해요','公共交通政策应先解决可靠性，再考虑形象工程'),L('education policy should reward durable understanding rather than short-term scores','教育政策は短期的な点数より長く残る理解を評価すべきです','교육 정책은 단기 점수보다 오래 남는 이해를 보상해야 해요','教育政策应奖励持久理解，而不是短期分数'),L('technology regulation works best when it targets incentives rather than individual products','技術規制は個別製品よりインセンティブ構造を対象にするとき最も機能します','기술 규제는 개별 제품보다 유인 구조를 겨냥할 때 더 효과적이에요','技术监管针对激励机制通常比针对单个产品更有效'),L('urban density can be beneficial only when services scale with it','都市密度はサービスも同時に拡充される場合に限って利点になります','도시 밀도는 서비스가 함께 확충될 때만 장점이 될 수 있어요','城市密度只有在服务同步扩张时才可能成为优势'),L('consumer choice is meaningful only when information is understandable','消費者の選択は情報が理解可能なときに初めて意味を持ちます','소비자 선택은 정보가 이해 가능할 때만 의미가 있어요','只有信息可理解时，消费者选择才真正有意义'),L('economic growth alone cannot describe whether everyday life is improving','経済成長だけでは日常生活が改善しているかを説明できません','경제 성장만으로 일상이 나아지는지 설명할 수는 없어요','仅靠经济增长无法说明日常生活是否真的变好'))},
];

const FRAMES={
 clarify:{
  en:['Do you mean “{a}” — {b}?','Just to check, when you say “{a}”, you mean {b}, right?','When you say “{a}”, are you talking about {b}?','I want to make sure I have this right: “{a}” means {b} here?','Let me check the reference point: by “{a}”, you mean {b}, correct?','Just so I do not read too much into it, “{a}” here is {b}, yes?'],
  ja:['「{a}」というのは、{b}という意味ですか？','確認ですが、「{a}」は{b}ということですよね？','「{a}」と言うと、ここでは{b}のことですか？','念のため確認すると、「{a}」は{b}という理解で合っていますか？','基準を合わせたいのですが、「{a}」は{b}という意味で合っていますか？','深読みしすぎないよう確認ですが、「{a}」はここでは{b}ということですよね？'],
  ko:['“{a}”라고 하신 게 {b}라는 뜻인가요?','확인만 할게요. “{a}”는 {b}라는 말씀이죠?','여기서 “{a}”라고 하면 {b}를 말하는 건가요?','제가 제대로 이해했는지 확인할게요. “{a}”는 {b}라는 뜻이죠?','기준을 맞추고 싶은데, “{a}”는 {b}라는 의미가 맞나요?','제가 너무 확대해서 이해하지 않게 확인할게요. 여기서 “{a}”는 {b}라는 거죠?'],
  zh:['你说“{a}”，是指{b}吗？','我确认一下，你说“{a}”就是{b}，对吗？','这里说“{a}”，你的意思是{b}吗？','我确认我没理解偏：“{a}”在这里是指{b}，对吧？','我想先把标准对齐一下，“{a}”是指{b}，对吗？','避免我自己想多了，确认一下：这里的“{a}”就是{b}，对吧？']},
 request:{
  en:['Can you {a} {b}?','Could you {a} {b}?','Would you mind helping me {a} {b}?','Any chance you could {a} {b}?','If it is not a pain, could you {a} {b}?','When it works for you, would you be able to {a} {b}?'],
  ja:['{b}、{a}もらえますか？','{b}、{a}もらってもいいですか？','{b}、もしよければ{a}もらえますか？','{b}、お願いできるなら{a}もらえますか？','{b}、手が空いたときに{a}もらえると助かります。','無理のないタイミングで、{b}、{a}もらえますか？'],
  ko:['{b} {a} 줄 수 있어요?','{b} {a} 주실래요?','{b} 괜찮으시면 {a} 주실 수 있어요?','{b} 혹시 {a} 주실 수 있을까요?','{b} 번거롭지 않으시면 {a} 주시면 좋겠어요.','편하실 때 {b} {a} 주실 수 있을까요?'],
  zh:['{b}，能{a}吗？','{b}，可以{a}吗？','{b}，方便的话能{a}吗？','{b}，你能不能{a}？','{b}，不麻烦的话想请你{a}。','你方便的时候，{b}，能帮我{a}吗？']},
 coordinate:{
  en:['Does {a} work? {b}.','How about {a}? {b}.','I can do {a}; {b}.','Would {a} be easier? {b}.','My preference would be {a}, mainly because {b}.','I am flexible, but {a} would work best because {b}.'],
  ja:['{a}でどうですか？ {b}。','{a}はどうでしょう？ {b}。','私は{a}なら大丈夫です。{b}。','{a}のほうがやりやすいですか？ {b}。','できれば{a}がいいです。というのも、{b}。','調整はできますが、{b}ので、{a}が一番助かります。'],
  ko:['{a} 어때요? {b}.','{a}는 괜찮아요? {b}.','저는 {a} 가능해요. {b}.','{a}가 더 편할까요? {b}.','저는 {a}가 제일 좋아요. {b}.','조정은 가능한데, {b}. 그래서 {a}가 가장 좋아요.'],
  zh:['{a}可以吗？{b}。','要不{a}？{b}。','我{a}可以，{b}。','{a}会不会更方便？{b}。','我更倾向于{a}，主要是因为{b}。','我可以调整，不过{b}，所以{a}最合适。']},
 service:{
  en:['There is a problem with the {a}. Could you {b}?','The {a} does not look right. Can you {b}?','Something is off with the {a}; could you {b}?','I think the {a} needs fixing. Would you be able to {b}?','I do not think the {a} matches what was agreed. Could we {b}?','The issue seems to be the {a}; rather than restarting everything, could you {b}?'],
  ja:['{a}に問題があります。{b}もらえますか？','{a}が合っていないようです。{b}もらえますか？','{a}が少しおかしいので、{b}もらえますか？','{a}は修正が必要だと思います。{b}もらうことはできますか？','{a}が合意した内容と違うようです。{b}ことはできますか？','問題は{a}のようなので、全部やり直すのではなく、{b}もらえますか？'],
  ko:['{a}에 문제가 있어요. {b} 주실 수 있어요?','{a}가 맞지 않는 것 같아요. {b} 주실 수 있어요?','{a}가 좀 이상한데, {b} 주실래요?','{a}는 수정이 필요한 것 같아요. {b} 주실 수 있을까요?','{a}가 합의한 내용과 다른 것 같아요. {b} 보는 건 어떨까요?','문제는 {a} 쪽인 것 같아요. 전부 다시 시작하기보다 {b} 주실 수 있을까요?'],
  zh:['{a}有点问题，能{b}吗？','{a}看起来不太对，能{b}吗？','{a}好像出了点问题，可以{b}吗？','我觉得{a}需要处理一下，你能{b}吗？','{a}似乎和我们确认的不一致，可以{b}吗？','问题应该就在{a}，不用全部重来，能直接{b}吗？']},
 social:{
  en:['How did {a} go? {b}.','So, how was {a}? {b}.','What was {a} actually like? {b}.','I have been meaning to ask about {a}. {b}.','I am curious how {a} felt from your side; {b}.','Give me the real version of {a}, not the summary. {b}.'],
  ja:['{a}、どうでした？ {b}。','そういえば、{a}はどうでした？ {b}。','実際のところ、{a}はどんな感じでした？ {b}。','{a}のこと、聞こうと思っていました。{b}。','{a}が実際どう感じたのか気になっています。{b}。','要約じゃなくて、{a}の本当のところを聞きたいです。{b}。'],
  ko:['{a} 어땠어요? {b}.','그러고 보니 {a} 어땠어요? {b}.','실제로 {a}는 어땠어요? {b}.','{a} 얘기 물어보려고 했어요. {b}.','직접 느낀 {a}가 어땠는지 궁금해요. {b}.','요약 말고 {a}의 진짜 버전으로 들려줘요. {b}.'],
  zh:['{a}怎么样？{b}。','对了，{a}怎么样？{b}。','实际的{a}到底怎么样？{b}。','我一直想问问{a}，{b}。','我挺想知道你自己感受到的{a}是什么样，{b}。','别讲总结版，我想听{a}真实发生的样子，{b}。']},
 boundary:{
  en:['I am okay with {a}, as long as {b}.','{a} is fine with me, but only if {b}.','I can work with {a}; I just need {b}.','I do not mind {a}. What matters to me is that {b}.','I am open to {a}, provided {b}.','I can be flexible about {a}; the boundary for me is that {b}.'],
  ja:['{a}のは大丈夫です。ただ、{b}なら。','{a}のは構いませんが、{b}ことが条件です。','{a}のは対応できます。私としては{b}ことだけ必要です。','{a}自体は気になりません。大事なのは{b}ことです。','{b}のであれば、{a}のは問題ありません。','{a}については柔軟にできますが、私の線引きは{b}ことです。'],
  ko:['{a}까지는 괜찮아요. 다만 {b}.','{a}는 괜찮은데, {b} 경우에만요.','{a}는 맞출 수 있어요. 저는 {b}면 돼요.','{a} 자체는 괜찮아요. 저한테 중요한 건 {b}.','{b}라면 {a}도 괜찮아요.','{a}는 유연하게 할 수 있는데, 제 기준은 {b}.'],
  zh:['{a}我可以接受，只要{b}。','{a}没问题，但前提是{b}。','{a}我可以配合，我只需要{b}。','我不介意{a}，对我来说关键是{b}。','如果{b}，那{a}可以。','{a}这件事我可以灵活一点，但我的边界是{b}。']},
 repair:{
  en:['I think I got {a} wrong. Could you {b}?','I may have misunderstood {a}. Can we {b}?','Sorry, I mixed up {a}. Could you {b}?','Let me correct myself on {a}; could we {b}?','I realized I was working from the wrong idea about {a}. Can we {b}?','I want to repair one thing before we continue: I had {a} wrong. Could we {b}?'],
  ja:['{a}を勘違いしていたかもしれません。{b}もらえますか？','{a}の理解が違っていたようです。{b}もらえますか？','すみません、{a}を取り違えていました。{b}もらえますか？','{a}について訂正します。{b}ことはできますか？','{a}を違う前提で考えていたことに気づきました。{b}もらえますか？','続ける前に一つ直したいです。{a}を勘違いしていました。{b}もらえますか？'],
  ko:['제가 {a}을 잘못 이해한 것 같아요. {b} 주실 수 있어요?','{a}을 오해한 것 같아요. {b} 볼 수 있을까요?','미안해요, 제가 {a}을 헷갈렸어요. {b} 주실래요?','{a} 부분은 제가 정정할게요. {b} 볼까요?','제가 {a}을 잘못된 전제로 보고 있었다는 걸 알았어요. {b} 주실 수 있을까요?','계속하기 전에 하나 바로잡을게요. 제가 {a}을 잘못 이해했어요. {b} 볼 수 있을까요?'],
  zh:['我好像把{a}理解错了，能{b}吗？','我可能误解了{a}，我们能{b}吗？','不好意思，我把{a}搞混了，能{b}吗？','我更正一下刚才关于{a}的理解，我们可以{b}吗？','我刚发现自己一直按错误的{a}在理解，能{b}吗？','继续之前我想先修正一个地方：我把{a}理解错了。我们能{b}吗？']},
 opinion:{
  en:['I think {a}, because {b}.','My view is that {a}; {b}.','I would argue that {a}, mainly because {b}.','On balance, I think {a}. The key point is that {b}.','I am inclined to think {a}, although the stronger reason is that {b}.','A more defensible position is that {a}; that holds especially when {b}.'],
  ja:['私の考えはこうです。{a}。理由は、{b}。','私はこう見ています。{a}。ポイントは、{b}。','私ならこう主張します。{a}。主な理由は、{b}。','総合的にはこう考えます。{a}。重要なのは、{b}。','私の立場は{a}というものです。ただ、より重要なのは{b}。','より妥当な立場は次の通りです。{a}。特に重要なのは、{b}。'],
  ko:['제 생각은 이래요. {a}. 이유는 {b}.','저는 이렇게 봐요. {a}. 핵심은 {b}.','저라면 이렇게 주장할 것 같아요. {a}. 주된 이유는 {b}.','전체적으로 보면 제 입장은 이거예요. {a}. 중요한 건 {b}.','저는 {a}는 쪽에 가까워요. 다만 더 중요한 이유는 {b}.','더 설득력 있는 입장은 이거예요. {a}. 특히 중요한 건 이 점이에요: {b}.'],
  zh:['我的看法是：{a}。原因是{b}。','我更倾向于这样看：{a}。关键是{b}。','如果要我主张一个立场，我会说：{a}。主要理由是{b}。','综合来看，我的判断是：{a}。重要的是{b}。','我更倾向于{a}。不过更有力的理由其实是{b}。','更站得住脚的说法是：{a}。尤其要看这一点：{b}。']},
 story:{
  en:['{a}, and then {b}.','So {a}. Then {b}.','The funny thing is, {a}; after that, {b}.','What happened was that {a}, which is how {b}.','It started with this: {a}. The part I did not expect was that {b}.','The sequence was almost backwards: {a}; in the end, {b}.'],
  ja:['{a}。それで、{b}。','まず{a}。そのあと、{b}。','面白いことに、{a}。それから、{b}。','実際には{a}ことが起きて、その結果、{b}。','始まりは{a}ことでした。予想外だったのは、{b}ことです。','順番がほとんど逆になって、{a}。最終的には{b}。'],
  ko:['{a}. 그리고 {b}.','일단 {a}. 그다음에 {b}.','재밌는 건 {a}. 그 뒤에 {b}.','실제로는 {a} 일이 있었고, 그래서 {b}.','시작은 {a}는 거였어요. 예상 못 한 건 {b}는 점이었고요.','순서가 거의 거꾸로였어요. {a}. 결국 {b}.'],
  zh:['{a}，然后{b}。','事情是这样：{a}。接着{b}。','有意思的是，{a}；后来{b}。','实际发生的是{a}，所以最后{b}。','事情从{a}开始。没想到的是，后来{b}。','整个顺序几乎反过来了：先是{a}，最后{b}。']}
};

const TAIL={
 en:{u:['Okay, that gives me enough to go on.','Got it — I just wanted the practical version.','That makes sense. I can work with that.','Perfect. I did not want to overcomplicate it.','Right, that is the part I needed.','Good. I can take it from here.','That clears it up for me.','Fair enough. I wanted to check before assuming.','Nice. That feels much more straightforward.','Okay, I know what I am doing now.','That is helpful. I was missing that piece.','Cool. I would rather be clear now than fix it later.','Makes sense. I will keep it simple.','All right. That is enough context for me.','Good call. I had been looking at it the wrong way.','That works. I will go with that.'],o:['Sounds good. Let me know if anything changes.','Exactly. We can adjust if we need to.','Yep. That should be enough for now.','No problem. We can leave it there.','Right. If something shifts, we can revisit it.','Perfect. That is the simplest way to handle it.','Sure. I would rather keep it clear too.','Yeah, that is how I would do it.','Great. We are on the same page then.','That should work. We do not need to force it.','Absolutely. The rest can stay flexible.','Fine by me. We can pick it up from there.','That is it. Nothing else needs changing.','Yep. Let us keep the next step obvious.','Agreed. We can deal with the edge cases if they come up.','Exactly. That keeps it easy for both of us.']},
 ja:{u:['分かりました。これで動けます。','なるほど、実際に必要なのはそこですね。','それなら大丈夫です。','分かりました。複雑にしすぎないようにします。','はい、知りたかったのはそこです。','助かります。あとは自分で進められます。','これではっきりしました。','先に確認しておいてよかったです。','なるほど、そのほうが自然ですね。','分かりました。次に何をすればいいか見えました。','助かります。そこが抜けていました。','今のうちにはっきりさせておきたかったです。','分かりました。シンプルにいきます。','十分分かりました。','なるほど、見方が少し違っていました。','それでいきます。'],o:['大丈夫です。変わったらまた言ってください。','はい。必要ならあとで調整しましょう。','それで今は十分だと思います。','問題ないです。いったんそこまでで。','そうですね。変わったらまた見直しましょう。','そのやり方が一番簡単です。','私もはっきりしているほうがいいです。','はい、私ならそうします。','これで認識は合いましたね。','それで大丈夫です。無理に決め切らなくてもいいです。','もちろんです。残りは柔軟で大丈夫です。','それでいきましょう。続きは必要なときに。','はい、それ以外は変えなくて大丈夫です。','次の一歩だけ分かりやすくしておきましょう。','そうですね。例外は出てきたときに考えれば大丈夫です。','はい。そのほうがお互い楽です。']},
 ko:{u:['알겠어요. 이제 어떻게 하면 될지 알겠네요.','좋아요. 제가 필요했던 건 실제로 그 부분이었어요.','그럼 괜찮아요.','알겠어요. 너무 복잡하게 생각하지 않을게요.','네, 제가 알고 싶었던 게 그거예요.','도움 됐어요. 이제 제가 이어서 하면 되겠네요.','이제 확실히 이해됐어요.','미리 확인하길 잘했네요.','좋아요. 그게 훨씬 자연스럽네요.','알겠어요. 다음에 뭘 해야 할지 보이네요.','도움 됐어요. 제가 그 부분을 놓치고 있었어요.','나중에 고치느니 지금 분명히 해두고 싶었어요.','좋아요. 간단하게 갈게요.','이 정도면 충분히 이해했어요.','그렇군요. 제가 조금 다르게 보고 있었네요.','그렇게 할게요.'],o:['좋아요. 바뀌는 게 있으면 알려주세요.','네. 필요하면 나중에 조정하면 돼요.','지금은 그 정도면 충분해요.','괜찮아요. 일단 여기까지만 해도 돼요.','맞아요. 달라지면 그때 다시 보면 돼요.','그게 제일 간단한 방법이에요.','저도 분명한 게 좋아요.','네, 저라면 그렇게 할 것 같아요.','좋아요. 이제 같은 얘기를 하고 있네요.','그 정도면 돼요. 굳이 억지로 정할 필요는 없어요.','물론이죠. 나머지는 유연하게 두면 돼요.','좋아요. 필요할 때 거기서 이어가죠.','네, 다른 건 안 바꿔도 돼요.','다음 단계만 분명하게 두면 돼요.','맞아요. 예외는 생기면 그때 처리하면 돼요.','네. 그게 서로 제일 편해요.']},
 zh:{u:['好，这样我就知道怎么做了。','明白，我真正需要的就是这一点。','那就可以。','好，我不把它想复杂了。','对，我刚才就是想确认这个。','有用了，剩下我自己接着做。','这样就清楚了。','幸好我先问了一下，没有自己猜。','好，这样听起来顺多了。','明白，我知道下一步是什么了。','有帮助，我刚才就缺这一块。','我宁愿现在说清楚，也不想之后返工。','懂了，那就简单一点来。','可以，这些信息够我用了。','明白，我之前看这个问题的角度有点偏。','行，我就按这个来。'],o:['好，有变化再告诉我。','对，需要的话后面再调。','嗯，现在这样就够了。','没问题，先到这里就行。','对，如果情况变了再重新看。','可以，这就是最简单的处理方式。','好，我也更喜欢说清楚一点。','对，我也会这么做。','好，那我们现在理解一致了。','这样应该可以，不用硬把所有东西都定死。','当然，其他部分保持灵活就好。','可以，需要的时候再从这里接着来。','对，其他东西不用改。','嗯，让下一步保持清楚就行。','同意，边角情况真出现了再处理。','对，这样对双方都最省事。']}
};

const ACK={
 en:['Sure.','Yeah, that makes sense.','Okay.','Got it.','Right.','Absolutely.','That is fair.','I see what you mean.'],
 ja:['はい。','なるほど。','分かりました。','そうですね。','了解です。','もちろんです。','それは分かります。','言いたいことは分かります。'],
 ko:['네.','그렇네요.','알겠어요.','좋아요.','맞아요.','물론이죠.','그건 이해돼요.','무슨 말인지 알겠어요.'],
 zh:['好。','明白。','可以。','懂了。','对。','当然。','这很合理。','我明白你的意思。']
};
const MID={
 en:['What matters most on your side?','Is there anything I should not assume?','Do you want the simple version or the detailed one?','What would make this easiest for you?','Is that the main thing, or is there another constraint?','Would you rather decide now or leave a little room?','What part are you least sure about?','Do you want me to be direct about it?'],
 ja:['そちらで一番大事なのは何ですか？','こちらで勝手に決めつけないほうがいい点はありますか？','簡単な説明と詳しい説明、どちらがいいですか？','どうすると一番やりやすいですか？','条件はそれだけですか、それとも他にもありますか？','今決めたいですか、それとも少し余地を残しますか？','どの部分が一番不確かですか？','率直に言ったほうがいいですか？'],
 ko:['그쪽에서 제일 중요한 건 뭐예요?','제가 함부로 가정하면 안 되는 게 있을까요?','간단한 버전이 좋아요, 자세한 버전이 좋아요?','어떻게 하면 제일 편할까요?','그게 가장 큰 조건이에요, 아니면 다른 것도 있어요?','지금 정할까요, 아니면 조금 열어 둘까요?','어느 부분이 제일 확실하지 않아요?','제가 좀 직접적으로 말해도 돼요?'],
 zh:['你这边最在意的是什么？','有什么是我最好别自己默认的吗？','你想听简单版还是详细版？','怎么做对你最省事？','主要限制就是这个，还是还有别的？','你想现在定，还是留一点余地？','你最不确定的是哪一部分？','要不要我直接一点说？']
};

const KIND_META={
 clarify:{intent:'先确认指代和边界，再继续对话',trap:'不要假装听懂；母语者常用一句很短的确认把歧义消掉。',transform:'把模糊词换成你今天真的听到过的一个词，再问一次。'},
 request:{intent:'请求具体动作，同时给对方时间和拒绝空间',trap:'不要每次都堆 please；礼貌更多来自语气、时机和可退出性。',transform:'把请求对象、时间和紧急程度各换一次。'},
 coordinate:{intent:'先给可执行选项，再补现实约束',trap:'不要只说 “I am fine / 都可以”；那会把决定重新推回对方。',transform:'换一个时间选项，再给一个真实限制。'},
 service:{intent:'把事实、问题、希望的下一步一次说清',trap:'不要只描述问题不说你想要什么；服务对话需要可执行的下一步。',transform:'把问题换成一次真实订单、预订或设备故障。'},
 social:{intent:'用一个有信息量的追问让闲聊继续',trap:'避免连续审问式问题；问一句之后要给一点自己的反应或信息。',transform:'把主题换成朋友最近真实发生的一件事。'},
 boundary:{intent:'保留关系的同时，把自己的条件说清楚',trap:'边界不是道歉大会；短、明确、可预测通常更友好。',transform:'把可接受部分和不可接受条件各改一次。'},
 repair:{intent:'快速承认理解偏差，然后直接修复',trap:'不用长篇解释为什么弄错；先把错误修正，让对话继续。',transform:'用一次你最近真的听错、记错、说错的情况重练。'},
 opinion:{intent:'观点 + 范围 + 原因，而不是只有立场',trap:'高级表达不是长词；真正的高级是会限定结论、解释机制。',transform:'把观点改成反方，再保留一个你仍同意的条件。'},
 story:{intent:'事件 → 转折 → 结果，让故事有推进',trap:'不要按时间流水账堆句子；听者需要知道为什么这件事值得听。',transform:'把结果换掉，再用同一开头讲一个不同版本。'}
};

const NOTES={
 en:['先把句子说短而完整。','开始加入自然缓冲，不要逐词翻译。','让信息按“动作/立场 → 条件”顺序出来。','开始使用省略、回指和更自然的节奏。','重点不是长词，而是分寸、限定和接话。','把句子当成真实互动，不把每个信息都说满。'],
 ja:['初级先把句尾说完整，不追求一次塞很多信息。','注意助词和句尾比逐字翻译更重要。','开始使用省略主语和自然的缓冲表达。','把信息分成短语块，避免中文式长句直译。','练习分寸：断定、保留、委婉之间要会切换。','母语感更多来自语境省略、句尾选择和节奏。'],
 ko:['先把句尾和敬语层级稳定下来。','不要按中文字序拼句子，先抓语块。','开始练自然的连接语尾，而不是每句都完整收尾。','注意语气层级和关系距离。','高级感来自限定、留白和自然反应，不是堆难词。','把句子放进关系和场景里，练真实的语气变化。'],
 zh:['先把意思说清楚，不堆书面词。','练口语里的省略、语气词和自然停顿。','开始用短句接力，而不是一次说完整篇。','注意“其实、主要是、要不、那就”等真实组织方式。','高级表达要有范围、转折和分寸。','母语感来自信息顺序、留白和对对方反应的预判。']
};

const hash=s=>{let h=2166136261;for(const ch of String(s)){h^=ch.codePointAt(0);h=Math.imul(h,16777619)}h>>>=0;h^=h>>>16;h=Math.imul(h,0x7feb352d);h^=h>>>15;h=Math.imul(h,0x846ca68b);h^=h>>>16;return h>>>0};
const fill=(s,a,b)=>String(s).replaceAll('{a}',a).replaceAll('{b}',b).replace(/\s+([?.!,;:])/g,'$1').replace(/\s{2,}/g,' ').trim();
const escRx=s=>String(s).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');

function render(kind,lang,level,a,b){const frames=FRAMES[kind]?.[lang]||FRAMES.clarify.en;return fill(frames[AXIS812_LEVELS.indexOf(level)]||frames[2],a,b)}
function trackRegister(track,level){if(track==='ielts')return'argument';if(['C1','C1+'].includes(level))return'native';if(['B1','B2'].includes(level))return'natural';return'clear'}
function speechTip(lang,level){const i=AXIS812_LEVELS.indexOf(level);if(lang==='en')return i<2?'先保留重读词，其余词轻一点。':'按意群说，功能词弱化，不要逐词等长。';if(lang==='ja')return i<2?'先保持拍子稳定，句尾不要拖重。':'注意高低起伏和语块，不按汉字逐字重读。';if(lang==='ko')return i<2?'先稳定句尾，前面的词连起来说。':'连接语尾要顺，句末敬语不要每个音都用力。';return i<2?'按意群停顿，不要一个字一个字蹦。':'重音放在新信息上，已知信息可以轻、快、略。'}
function connected(lang,target){if(lang==='en')return target.replace(/\bgoing to\b/gi,'gonna').replace(/\bwant to\b/gi,'wanna').replace(/\bgot to\b/gi,'gotta');if(lang==='ja')return'整句按语块连接；助词轻，关键信息更清楚。';if(lang==='ko')return'把词干和语尾连成一个节奏单位，不要每个词都断开。';return'把虚词和已知信息说轻，真正的新信息更突出。'}
function cloze(target,a){const rx=new RegExp(escRx(a),'i');return rx.test(target)?target.replace(rx,'＿＿＿'):target.replace(/\S+(?=[^\s]*[?.!。？！]?$)/,'＿＿＿')}

function conversation(lang,id,target,alt){const h=hash(id),ack=ACK[lang]||ACK.en,mid=MID[lang]||MID.en,tail=TAIL[lang]||TAIL.en;const a=ack[h%ack.length],q=mid[(h>>>3)%mid.length],u=tail.u[(h>>>7)%tail.u.length],o=tail.o[(h>>>13)%tail.o.length];const a2=ack[(h>>>17)%ack.length],q2=mid[(h>>>21)%mid.length];return [target,a,q,a2,alt||target,q2,u,o]}
function extension(lang,id){const h=hash(id+'::ext'),tail=TAIL[lang]||TAIL.en,mid=MID[lang]||MID.en,ack=ACK[lang]||ACK.en;return[mid[(h>>>2)%mid.length],ack[(h>>>8)%ack.length],tail.u[(h>>>12)%tail.u.length],tail.o[(h>>>18)%tail.o.length]]}

export function buildAxis812NativeStudio(lang='en'){
 if(!AXIS812_LANGS.includes(lang))lang='en';
 const out=[];
 for(const family of AXIS812_FAMILIES){const bset=AXIS812_CONTEXTS[family.b];for(let ai=0;ai<family.a.length;ai++)for(let bi=0;bi<bset.length;bi++)for(let li=0;li<AXIS812_LEVELS.length;li++){
  const level=AXIS812_LEVELS[li],a=family.a[ai][lang],b=bset[bi][lang],target=render(family.kind,lang,level,a,b),next=AXIS812_LEVELS[Math.min(li+1,AXIS812_LEVELS.length-1)],alt=render(family.kind,lang,next,a,b),id=`${lang}812-${family.id}-${String(ai+1).padStart(2,'0')}-${String(bi+1).padStart(2,'0')}-${level.replace('+','p')}`;
  const zh=render(family.kind,'zh',level,family.a[ai].zh,bset[bi].zh),meta=KIND_META[family.kind]||KIND_META.clarify,conv=conversation(lang,id,target,alt),ext=extension(lang,id);
  out.push({id,lang,source:'studio-812',family:family.id,scenario:family.scenario,intent:family.intent,kind:family.kind,track:family.track,level,register:trackRegister(family.track,level),target,zh,alt,response:conv[1],followup:conv[2],closing:conv[3],turn5:conv[4],turn6:conv[5],conversation:conv,conversationExtension:ext,nativeNote:NOTES[lang][li],connected:connected(lang,target),pron:speechTip(lang,level),spelling:lang==='en'?target.replace(/[^A-Za-z' -]/g,'').trim():target,dictation:target,shadow:target,stress:lang==='en'?'重读内容词；连接词和功能词更轻。':'把新信息说得更清楚，已知信息更轻。',chunking:target.split(/[,，;；:：]/).map(x=>x.trim()).filter(Boolean).slice(0,4),lesson:{method:'meaning-noticing-retrieval-response-shadow-transform-review',intent:meta.intent,notice:NOTES[lang][li],contrast:`自然表达 · ${target}\n更完整/更高阶 · ${alt}`,cloze:cloze(target,a),recall:`不看原句：${family.scenario}。用${lang==='en'?'英语':lang==='ja'?'日语':lang==='ko'?'韩语':'中文'}把这个意图说出来。`,respond:conv[2],transform:meta.transform,trap:meta.trap,reviewTags:[family.kind,family.track,level],steps:['看懂意图','注意母语差异','盲回想','接下一句','影子跟读','换条件再说','隔天复现']}})
 }}return out
}

export function buildAxis812All(){return Object.fromEntries(AXIS812_LANGS.map(lang=>[lang,buildAxis812NativeStudio(lang)]))}

export function auditAxis812(){
 const oldEn=buildAxis811Atlas(),oldMulti=buildAxis811Multilingual(),old={en:oldEn,ja:oldMulti.ja||[],ko:oldMulti.ko||[],zh:oldMulti.zh||[]},all=buildAxis812All(),counts={},tailMax={};
 for(const lang of AXIS812_LANGS){const units=all[lang],targets=new Set(),oldTargets=new Set((old[lang]||[]).map(x=>String(x.target||'').trim().toLowerCase())),tails=new Map();for(const u of units){const k=u.target.trim().toLowerCase();if(targets.has(k))throw new Error(`[AXIS 8.12] duplicate ${lang} target: ${u.target}`);targets.add(k);if(oldTargets.has(k))throw new Error(`[AXIS 8.12] legacy exact overlap ${lang}: ${u.target}`);if(u.conversation.length!==8||u.conversationExtension.length!==4)throw new Error(`[AXIS 8.12] dialogue depth ${u.id}`);if(new Set(u.conversation.map(x=>String(x).trim())).size<6)throw new Error(`[AXIS 8.12] dialogue repetition ${u.id}`);const t=u.conversation.slice(-2).join(' || ');tails.set(t,(tails.get(t)||0)+1);for(const k2 of ['intent','notice','contrast','cloze','recall','respond','transform','trap'])if(!u.lesson?.[k2])throw new Error(`[AXIS 8.12] lesson missing ${k2} ${u.id}`)}counts[lang]=units.length;tailMax[lang]=Math.max(...tails.values());if(tailMax[lang]>40)throw new Error(`[AXIS 8.12] repetitive tail pair ${lang}: ${tailMax[lang]}`)}
 return{version:AXIS812_VERSION,newByLanguage:counts,legacyByLanguage:{en:old.en.length,ja:old.ja.length,ko:old.ko.length,zh:old.zh.length},availableByLanguage:Object.fromEntries(AXIS812_LANGS.map(lang=>[lang,(old[lang]||[]).length+counts[lang]])),totalNew:Object.values(counts).reduce((a,b)=>a+b,0),totalAvailable:AXIS812_LANGS.reduce((n,lang)=>n+(old[lang]||[]).length+counts[lang],0),tailPairMax:tailMax,dialogueTurns:AXIS812_TURNS,teachingLoop:['meaning','noticing','retrieval','response','shadow','transform','review']}
}
