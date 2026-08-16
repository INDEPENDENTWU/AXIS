const LEVELS=['A1','A1','A2','A2','B1','B1','B2','B2','C1','C1'];

const SCENES=[
{
 scenario:'听清与确认',track:'daily',register:'自然礼貌口语',
 sem:[
  ['可以再说一遍吗？','Could you say that again?'],['可以说慢一点吗？','Could you speak a little more slowly?'],['你是说这个吗？','Do you mean this one?'],['确认一下，是六点对吗？','Just to check, it is six, right?'],['我没听清最后那部分。','I missed the last part.'],['你说“晚一点”是指今晚吗？','When you say “later,” do you mean tonight?'],['我确认一下，我理解的是明天之前完成，对吗？','Let me make sure I understood: this needs to be done by tomorrow, right?'],['我可能理解错了，你能换个说法吗？','I may have misunderstood. Could you put it another way?'],['我想把这个细节弄准确：你指的是时间还是地点？','I want to get this detail right: do you mean the time or the place?'],['为了避免我们理解不一致，我再确认一次：最终决定还没有定，对吗？','Just so we are aligned, let me check once more: the final decision has not been made yet, right?']
 ],
 ja:['もう一度お願いします。','もう少しゆっくり話してもらえますか？','これのことですか？','確認ですが、6時で合っていますか？','最後のところが聞き取れませんでした。','「あとで」というのは、今夜という意味ですか？','確認させてください。明日までに終わらせる、という理解で合っていますか？','私が勘違いしているかもしれません。別の言い方で説明してもらえますか？','この点を正確に確認したいのですが、時間のことですか、それとも場所のことですか？','認識のずれを避けたいので、もう一度だけ確認します。最終決定はまだ、ということで合っていますか？'],
 ko:['다시 한 번 말해 주세요.','조금만 천천히 말해 주실래요?','이걸 말씀하시는 건가요?','확인만 할게요. 6시 맞죠?','마지막 부분을 잘 못 들었어요.','“나중에”라고 하신 게 오늘 저녁을 말씀하시는 건가요?','제가 제대로 이해했는지 확인할게요. 내일까지 끝내면 되는 거죠?','제가 잘못 이해했을 수도 있는데, 다른 말로 설명해 주실 수 있을까요?','이 부분을 정확히 확인하고 싶은데요. 시간 말씀인가요, 장소 말씀인가요?','서로 다르게 이해하는 걸 피하려고 한 번만 더 확인할게요. 최종 결정은 아직 안 난 거죠?'],
 turns:{ja:['はい、そうです。','ありがとうございます。確認したかっただけです。','大丈夫です。','では、その認識で進めます。','了解です。'],ko:['네, 맞아요.','감사합니다. 정확히 확인하고 싶었어요.','괜찮아요.','그럼 그렇게 이해하고 진행할게요.','알겠습니다.'],zh:['对，就是这个意思。','谢谢，我只是想确认准确。','没问题。','那我就按这个理解继续。','好，明白了。']}
},
{
 scenario:'时间与改计划',track:'daily',register:'自然安排口语',
 sem:[
  ['你今天下午有空吗？','Are you free this afternoon?'],['七点可以吗？','Would seven work?'],['我们改到明天可以吗？','Could we move it to tomorrow?'],['我可能会晚一点。','I might be a little late.'],['临时有点事，能往后推一小时吗？','Something came up. Could we push it back an hour?'],['我时间比较灵活，你方便的时候就行。','I am flexible, so whenever works for you is fine.'],['时间先不定死，可以吗？','Could we keep the timing open for now?'],['我确认日程以后马上告诉你。','I will let you know as soon as my schedule is clear.'],['如果优先考虑不赶时间，我更倾向晚一点开始。','If avoiding a rush is the priority, I would lean toward starting a bit later.'],['我不想把时间安排得太死；我们先保留一个范围，临近时再确认具体时间吧。','I do not want to over-fix the timing. Let us keep a window and confirm the exact time closer to it.']
 ],
 ja:['今日の午後、空いていますか？','7時で大丈夫ですか？','明日に変更してもいいですか？','少し遅れるかもしれません。','急に予定が入ってしまって、1時間ほど遅らせてもらえますか？','私は時間を合わせられるので、都合のいい時間で大丈夫です。','今のところ、時間は決めずにおいてもいいですか？','予定がはっきりしたら、すぐに連絡します。','急がずに済むことを優先するなら、少し遅めに始めるほうがいいと思います。','時間をきっちり決めすぎたくないので、まず幅を持たせておいて、近くなったら具体的な時間を確認しませんか？'],
 ko:['오늘 오후에 시간 괜찮으세요?','7시는 괜찮으세요?','내일로 바꿔도 될까요?','조금 늦을 수도 있어요.','갑자기 일이 생겨서 그런데, 한 시간 정도 미뤄도 될까요?','저는 시간 조정이 가능해서 편하신 시간에 맞출게요.','일단 시간은 열어 두고 나중에 정해도 될까요?','일정이 확실해지면 바로 알려 드릴게요.','서두르지 않는 게 우선이라면 조금 늦게 시작하는 쪽이 나을 것 같아요.','시간을 너무 딱 정해 두기보다는 범위를 잡아 두고, 가까워졌을 때 정확한 시간을 다시 확인하면 좋겠어요.'],
 turns:{ja:['大丈夫です。','では、その時間にしましょう。','もし変わったら連絡します。','ありがとうございます。','よろしくお願いします。'],ko:['괜찮아요.','그럼 그 시간으로 할게요.','바뀌면 바로 알려 드릴게요.','감사합니다.','좋아요.'],zh:['可以。','那就先这么定。','有变化我会马上说。','谢谢。','好，就这样。']}
},
{
 scenario:'请求帮助与协作',track:'daily',register:'礼貌直接口语',
 sem:[
  ['能帮我一下吗？','Could you help me?'],['能帮我拿一下这个吗？','Could you help me carry this?'],['可以帮我看一下这里吗？','Could you take a look at this?'],['你方便告诉我下一步怎么做吗？','Could you tell me what I should do next?'],['如果你有空，能帮我确认一下这个吗？','If you have a moment, could you help me check this?'],['我自己试过了还是不太确定，你能帮我看看吗？','I tried it myself but I am still not sure. Could you take a look?'],['不用全部帮我做，我只需要你帮我确认这个步骤。','You do not need to do the whole thing for me. I just need help checking this step.'],['如果你现在不方便也没关系，我主要想确认我没有走错方向。','No problem if now is not convenient. I mainly want to make sure I am not heading in the wrong direction.'],['我想先自己处理，不过在继续之前，希望你能帮我验证一下我的判断。','I would like to handle it myself, but before I continue, I would appreciate a quick check of my judgment.'],['我不想占用你太多时间；如果你能指出最关键的一个问题，我就可以自己继续。','I do not want to take much of your time. If you can point out the single most important issue, I can take it from there.']
 ],
 ja:['ちょっと手伝ってもらえますか？','これを運ぶのを手伝ってもらえますか？','ここを少し見てもらえますか？','次に何をすればいいか教えてもらえますか？','もし時間があれば、これを確認してもらえますか？','自分でもやってみたんですが、まだ少し自信がなくて。見てもらえますか？','全部やってもらう必要はなくて、この手順だけ合っているか確認してもらえれば大丈夫です。','今難しければ大丈夫です。方向を間違えていないかだけ確認したいんです。','できるだけ自分で進めたいのですが、続ける前に私の判断が合っているか一度見てもらえると助かります。','あまり時間を取らせたくないので、一番重要な問題だけ教えてもらえれば、あとは自分で進めます。'],
 ko:['잠깐 도와주실 수 있어요?','이거 옮기는 것 좀 도와주실래요?','여기 한번 봐주실 수 있을까요?','다음에 뭘 하면 되는지 알려 주실 수 있을까요?','시간 괜찮으시면 이것 좀 확인해 주실래요?','저도 직접 해봤는데 아직 확신이 안 서서요. 한번 봐주실 수 있을까요?','전부 해주실 필요는 없고, 이 단계만 맞는지 확인해 주시면 돼요.','지금 어려우시면 괜찮아요. 제가 방향을 잘못 잡은 건 아닌지만 확인하고 싶어요.','가능하면 제가 직접 처리하고 싶은데, 계속하기 전에 제 판단이 맞는지 한번 확인해 주시면 좋겠어요.','시간을 많이 뺏고 싶지는 않아요. 가장 중요한 문제 하나만 짚어 주시면 나머지는 제가 이어서 할게요.'],
 turns:{ja:['もちろんです。','どの部分を見ればいいですか？','ここだけお願いします。','分かりました。','助かります。'],ko:['물론이죠.','어느 부분을 보면 될까요?','여기만 봐주시면 돼요.','알겠습니다.','도움이 됐어요.'],zh:['当然。','你想让我看哪一部分？','这里就好。','明白。','帮大忙了。']}
},
{
 scenario:'社交与自然接话',track:'social',register:'轻松自然口语',
 sem:[
  ['最近怎么样？','How have you been?'],['今天过得怎么样？','How is your day going?'],['你最近在忙什么？','What have you been up to lately?'],['听起来挺不错的。','That sounds pretty good.'],['我最近也差不多。','I have been about the same lately.'],['说起来，我最近开始重新做这件事了。','Speaking of that, I recently started doing it again.'],['我本来没太期待，不过结果比想象中有意思。','I was not expecting much, but it turned out to be more interesting than I thought.'],['我还没有完全想好，不过目前感觉不错。','I have not completely made up my mind, but so far it feels good.'],['我觉得有趣的是，我以前不会注意这个，现在反而越来越在意。','What I find interesting is that I never used to notice this, but now I care about it more and more.'],['如果简单说，我最近就是在尽量把生活安排得更松一点，同时保留真正想做的事。','If I had to put it simply, lately I have been trying to leave more room in my life while keeping the things I genuinely want to do.']
 ],
 ja:['最近どうですか？','今日はどうですか？','最近、何してるんですか？','それ、けっこう良さそうですね。','私も最近はだいたいそんな感じです。','そういえば、最近またそれを始めたんです。','正直あまり期待してなかったんですが、思ったより面白かったです。','まだ完全には決めてないんですけど、今のところはいい感じです。','面白いのは、前は全然気にしてなかったのに、最近はむしろそこが気になるようになったことです。','簡単に言うと、最近は予定を詰めすぎず、本当にやりたいことだけはちゃんと残すようにしています。'],
 ko:['요즘 어떻게 지내세요?','오늘 하루는 어때요?','요즘 뭐 하면서 지내세요?','그거 꽤 괜찮아 보이네요.','저도 요즘은 비슷해요.','그러고 보니 저도 최근에 그걸 다시 시작했어요.','별 기대 안 했는데 생각보다 훨씬 재미있었어요.','아직 완전히 결정한 건 아닌데, 지금까지는 느낌이 좋아요.','재미있는 건 예전에는 전혀 신경 쓰지 않던 부분인데 요즘은 오히려 그게 더 중요하게 느껴진다는 거예요.','간단히 말하면 요즘은 일정을 너무 꽉 채우지 않으면서도 정말 하고 싶은 건 남겨 두려고 해요.'],
 turns:{ja:['そうなんですね。','それはいいですね。','そっちはどうですか？','私は最近こんな感じです。','また話しましょう。'],ko:['그렇군요.','좋네요.','그쪽은 어때요?','저는 요즘 이런 편이에요.','또 얘기해요.'],zh:['这样啊。','听起来不错。','你呢？','我最近大概就是这样。','回头再聊。']}
},
{
 scenario:'出行与问路',track:'travel',register:'清楚实用口语',
 sem:[
  ['车站在哪里？','Where is the station?'],['从这里走过去远吗？','Is it far to walk from here?'],['我应该在哪一站下？','Which stop should I get off at?'],['这趟车去市中心吗？','Does this train go downtown?'],['我走这个方向对吗？','Am I heading in the right direction?'],['如果走路和坐车差不多，我宁愿走过去。','If walking takes about the same time, I would rather walk.'],['哪种方式最省事，不一定要最快？','What is the easiest option, not necessarily the fastest?'],['我需要换乘吗，还是可以一直坐到那里？','Do I need to transfer, or can I stay on until I get there?'],['我主要担心错过末班车，你觉得现在走哪条路线更稳妥？','I am mainly worried about missing the last service. Which route would be safer at this time?'],['如果考虑到行李和这个时间段的拥挤程度，你会建议我走哪种方式？','Taking the luggage and how crowded it gets at this time into account, which option would you recommend?']
 ],
 ja:['駅はどこですか？','ここから歩くと遠いですか？','どの駅で降りればいいですか？','この電車は中心部まで行きますか？','この方向で合っていますか？','歩いても時間があまり変わらないなら、歩いて行きたいです。','一番早くなくてもいいので、いちばん分かりやすい行き方はどれですか？','乗り換えが必要ですか？それともこのまま乗っていれば着きますか？','終電を逃すのが一番心配なんですが、今の時間ならどのルートがいちばん確実だと思いますか？','荷物があることと、この時間帯の混み具合まで考えると、どの行き方がおすすめですか？'],
 ko:['역이 어디예요?','여기서 걸어가면 멀어요?','어느 역에서 내려야 해요?','이 열차는 시내로 가나요?','제가 지금 가는 방향이 맞나요?','걸어가는 시간이 크게 차이 안 나면 그냥 걸어가고 싶어요.','꼭 제일 빠르지 않아도 되는데, 가장 편한 방법이 뭐예요?','환승해야 하나요, 아니면 여기서 계속 타고 가면 되나요?','막차를 놓치는 게 제일 걱정인데, 지금 시간에는 어느 경로가 더 안전할까요?','짐이 있는 것과 이 시간대 혼잡도까지 생각하면 어떤 방법을 추천하시겠어요?'],
 turns:{ja:['こちらです。','だいたいその方向で大丈夫です。','ありがとうございます。','気をつけて行ってください。','助かりました。'],ko:['이쪽이에요.','대체로 그 방향이 맞아요.','감사합니다.','조심해서 가세요.','도움이 됐어요.'],zh:['在这边。','大方向是对的。','谢谢。','路上小心。','太有用了。']}
},
{
 scenario:'餐饮与服务',track:'service',register:'自然服务口语',
 sem:[
  ['可以给我这个吗？','Could I have this?'],['这个可以外带吗？','Can I get this to go?'],['可以少放一点辣吗？','Could you make it a little less spicy?'],['你最推荐哪个？','Which one would you recommend most?'],['这个里面有坚果吗？','Does this contain nuts?'],['如果我想吃清淡一点，你会推荐哪个？','What would you recommend if I want something lighter?'],['不好意思，我点的好像不是这个。','Sorry, I do not think this is what I ordered.'],['不用重新做全部，如果可以把这个换掉就好。','You do not need to remake everything. If possible, just replacing this part is fine.'],['我不是想投诉，只是想确认这个收费是不是和菜单上的一致。','I am not trying to complain. I just want to check whether this charge matches the menu.'],['整体都很好，我只是想把这个小问题处理掉，不需要把整件事复杂化。','Everything else is fine. I just want to sort out this small issue without making the whole thing complicated.']
 ],
 ja:['これをお願いします。','これは持ち帰りにできますか？','辛さを少し控えめにできますか？','一番おすすめはどれですか？','これにはナッツが入っていますか？','もう少し軽めに食べたいんですが、何がおすすめですか？','すみません、注文したものと違うようです。','全部作り直さなくて大丈夫なので、できればここだけ替えてもらえますか？','苦情というわけではないんですが、この料金がメニューの表示と合っているか確認したいです。','ほかは全部問題ないので、この小さな点だけ解決できれば十分です。話を大きくするつもりはありません。'],
 ko:['이걸로 주세요.','이거 포장할 수 있나요?','조금 덜 맵게 해주실 수 있나요?','가장 추천하시는 건 뭐예요?','이 안에 견과류가 들어 있나요?','조금 가볍게 먹고 싶은데 어떤 메뉴를 추천하세요?','죄송한데 제가 주문한 메뉴와 다른 것 같아요.','전부 다시 해주실 필요는 없고, 가능하면 이 부분만 바꿔 주시면 돼요.','불만을 제기하려는 건 아니고요. 이 금액이 메뉴에 적힌 것과 맞는지만 확인하고 싶어요.','나머지는 다 괜찮아요. 이 작은 문제만 해결되면 충분하고 일을 크게 만들고 싶지는 않아요.'],
 turns:{ja:['かしこまりました。','確認しますね。','ありがとうございます。','すぐ対応します。','助かります。'],ko:['네, 알겠습니다.','확인해 볼게요.','감사합니다.','바로 처리해 드릴게요.','좋아요.'],zh:['好的。','我帮你确认一下。','谢谢。','马上处理。','这样就好。']}
},
{
 scenario:'购物与处理问题',track:'service',register:'直接但礼貌',
 sem:[
  ['这个多少钱？','How much is this?'],['可以试一下吗？','Can I try this on?'],['还有别的尺寸吗？','Do you have another size?'],['我只是看看，谢谢。','I am just looking, thanks.'],['这个好像有一点问题。','There seems to be a small problem with this.'],['我买回去以后才发现这里有损坏。','I only noticed the damage after I got home.'],['如果不能退款，换一个也可以。','If a refund is not possible, an exchange would also be fine.'],['我想先了解有哪些处理方式，再决定怎么做。','I would like to know what options I have before deciding what to do.'],['我理解可能有规定，我只是想找到一个对双方都最简单的解决办法。','I understand there may be a policy. I am just looking for the simplest solution for both sides.'],['我并不是要求特殊待遇；我只希望实际情况和购买时提供的信息能够对得上。','I am not asking for special treatment. I just want the actual situation to match the information I was given when I bought it.']
 ],
 ja:['これはいくらですか？','試着してもいいですか？','別のサイズはありますか？','見ているだけです。ありがとうございます。','これ、少し問題があるようです。','家に帰ってから、ここが傷んでいることに気づきました。','返金が難しければ、交換でも大丈夫です。','まずどんな対応ができるのか聞いてから、どうするか決めたいです。','ルールがあるのは理解しています。できれば、お互いに一番簡単な解決方法を見つけたいです。','特別扱いを求めているわけではありません。購入時に聞いた内容と実際の状態が一致していれば、それでいいんです。'],
 ko:['이거 얼마예요?','입어봐도 될까요?','다른 사이즈도 있나요?','그냥 보고 있어요. 감사합니다.','이거 조금 문제가 있는 것 같아요.','집에 가서야 여기 손상된 부분을 발견했어요.','환불이 어렵다면 교환도 괜찮아요.','어떤 처리 방법이 가능한지 먼저 듣고 나서 결정하고 싶어요.','규정이 있을 수 있다는 건 이해해요. 다만 서로에게 가장 간단한 해결 방법을 찾고 싶어요.','특별 대우를 원하는 건 아니에요. 구매할 때 안내받은 내용과 실제 상태가 맞기만 하면 됩니다.'],
 turns:{ja:['確認します。','こちらの方法が可能です。','それなら大丈夫です。','手続きを進めますね。','ありがとうございます。'],ko:['확인해 볼게요.','이 방법으로 처리할 수 있어요.','그럼 괜찮아요.','바로 진행해 드릴게요.','감사합니다.'],zh:['我确认一下。','可以这样处理。','那就可以。','我来帮你办。','谢谢。']}
},
{
 scenario:'健身房共用器械',track:'gym',register:'健身房自然口语',
 sem:[
  ['这个有人用吗？','Is anyone using this?'],['你还剩几组？','How many sets do you have left?'],['我可以和你轮流用吗？','Can I work in with you?'],['你做完可以告诉我一声吗？','Could you let me know when you are done?'],['没事，我可以等。','No problem, I can wait.'],['我只剩最后一组，很快。','I only have one set left. I will be quick.'],['如果你休息时间比较长，我们可以轮流用。','If your rest periods are long, we could alternate.'],['重量不用帮我调，我自己来就好。','You do not need to change the weight for me. I can do it myself.'],['我不赶时间，你先按自己的节奏做，我只想知道大概还要多久。','I am not in a rush. Keep your pace; I just want a rough idea of how long you have left.'],['我们不用互相打乱训练节奏；如果方便的话，就在各自休息的时候轮换一下。','We do not need to disrupt each other’s training. If it works, we can switch during each other’s rest periods.']
 ],
 ja:['これ、使っていますか？','あと何セットですか？','交代で使ってもいいですか？','終わったら声をかけてもらえますか？','大丈夫です。待てます。','あと1セットだけなので、すぐ終わります。','休憩が長めなら、交代で使いませんか？','重量は変えなくて大丈夫です。自分で調整します。','急いでいないので、自分のペースで大丈夫です。あとどれくらいかだけ分かれば助かります。','お互いのトレーニングの流れを崩さなくていいので、休憩のタイミングで交代できれば十分です。'],
 ko:['이거 사용하고 계세요?','몇 세트 남으셨어요?','저랑 번갈아 써도 될까요?','끝나시면 말씀해 주실래요?','괜찮아요. 기다릴 수 있어요.','저 한 세트만 남아서 금방 끝나요.','휴식 시간이 좀 길면 번갈아 쓰는 건 어때요?','무게는 안 바꿔 주셔도 돼요. 제가 직접 조절할게요.','저는 급하지 않으니까 하시던 페이스대로 하세요. 대략 얼마나 남았는지만 알면 돼요.','서로 운동 흐름을 방해할 필요는 없으니까, 각자 쉬는 시간에 번갈아 쓰면 좋을 것 같아요.'],
 turns:{ja:['どうぞ。','あと1セットです。','分かりました。','休憩のときに替わりましょう。','ありがとうございます。'],ko:['네, 쓰셔도 돼요.','한 세트 남았어요.','알겠습니다.','쉬는 동안 번갈아 써요.','감사합니다.'],zh:['可以。','我还剩一组。','明白。','休息的时候轮换就好。','谢谢。']}
},
{
 scenario:'动作反馈与训练判断',track:'gym',register:'清楚克制口语',
 sem:[
  ['这样做对吗？','Am I doing this right?'],['我应该再低一点吗？','Should I go a little lower?'],['这里应该有感觉吗？','Should I be feeling it here?'],['这个重量对我来说有点重。','This weight feels a little heavy for me.'],['我想先把动作做稳，再加重量。','I want to make the movement solid before adding weight.'],['这一组最后两次动作开始变形了。','My form started to break down on the last two reps.'],['我不确定这是正常疲劳还是重量太重。','I am not sure whether this is normal fatigue or the weight is too heavy.'],['我宁愿少做一次，也不想为了完成次数把动作做坏。','I would rather do one fewer rep than ruin the movement just to hit the number.'],['今天我更想把每一组留一点余量，而不是每组都做到极限。','Today I would rather leave a little in reserve on each set than push every set to the limit.'],['我想判断的是这个动作是否还能保持稳定，而不是单纯看我能不能把重量举起来。','What I want to judge is whether the movement stays stable, not simply whether I can move the weight.']
 ],
 ja:['このやり方で合っていますか？','もう少し深く下げたほうがいいですか？','ここに効く感じで合っていますか？','この重量は私には少し重いです。','まずフォームを安定させてから重量を上げたいです。','このセットは最後の2回でフォームが崩れ始めました。','これは普通の疲れなのか、重量が重すぎるのか判断がつきません。','回数を達成するためにフォームを崩すくらいなら、1回少なくてもいいです。','今日は毎セット少し余裕を残して、全部を限界までやらないようにしたいです。','見たいのは単に重量を動かせるかではなく、動作を最後まで安定させられるかどうかです。'],
 ko:['이렇게 하는 게 맞나요?','조금 더 내려가야 하나요?','여기에 자극이 오는 게 맞나요?','이 무게는 저한테 조금 무거워요.','먼저 자세를 안정시키고 나서 무게를 올리고 싶어요.','이번 세트는 마지막 두 번에서 자세가 무너지기 시작했어요.','이게 정상적인 피로인지 무게가 너무 무거운 건지 잘 모르겠어요.','횟수를 채우려고 자세를 망칠 바에는 한 번 덜 하는 게 나아요.','오늘은 매 세트 조금 여유를 남기고, 매번 한계까지 가지 않으려고 해요.','제가 보려는 건 단순히 무게를 들 수 있느냐가 아니라 동작을 끝까지 안정적으로 유지할 수 있느냐예요.'],
 turns:{ja:['その考え方で大丈夫です。','まず動きを安定させましょう。','次のセットで確認してみてください。','無理に増やさなくて大丈夫です。','了解です。'],ko:['그렇게 생각하시면 돼요.','먼저 동작을 안정시키세요.','다음 세트에서 한번 확인해 보세요.','억지로 올릴 필요는 없어요.','알겠습니다.'],zh:['这个思路对。','先把动作稳定下来。','下一组再确认。','不用急着加重量。','明白。']}
},
{
 scenario:'工作更新与反馈',track:'work',register:'自然专业口语',
 sem:[
  ['我已经做完了。','I have finished it.'],['我还需要一点时间。','I need a little more time.'],['目前进展正常。','Everything is on track so far.'],['有一个小问题，但还不会影响整体时间。','There is a small issue, but it should not affect the overall timing yet.'],['我先给你一个简短更新：主要部分已经完成。','A quick update: the main part is already done.'],['我卡在一个细节上，想先确认再继续。','I am stuck on one detail and want to confirm it before continuing.'],['最强的部分我会保留，只调整现在真正影响结果的地方。','I will keep the strongest part and only change what is actually affecting the result.'],['我不想为了看起来更完整而增加没有必要的东西。','I do not want to add unnecessary things just to make it look more complete.'],['目前的核心判断没有变，只是有一个新细节需要纳入考虑。','The core judgment has not changed; there is just one new detail we need to factor in.'],['如果把次要信息拿掉，真正需要决定的其实只有一个问题，我建议先把它解决。','If we strip away the secondary information, there is really only one decision we need to make. I suggest we solve that first.']
 ],
 ja:['終わりました。','もう少し時間が必要です。','今のところ予定どおり進んでいます。','小さな問題はありますが、今のところ全体のスケジュールには影響しないと思います。','簡単に進捗を共有します。主要な部分はすでに終わっています。','一つの細かい点で止まっていて、続ける前に確認したいです。','一番良い部分は残して、今ほんとうに結果に影響しているところだけ直します。','完成度が高く見えるようにするためだけに、必要のないものを増やしたくありません。','中心となる判断は変わっていません。ただ、新しい情報を一つ考慮する必要があります。','重要でない情報を外すと、実際に決める必要があるのは一つだけです。まずそこを解決するのがいいと思います。'],
 ko:['끝냈어요.','시간이 조금 더 필요해요.','지금까지는 계획대로 진행되고 있어요.','작은 문제가 하나 있지만 아직 전체 일정에는 영향이 없을 것 같아요.','간단히 진행 상황을 말씀드리면, 핵심 부분은 이미 끝났어요.','세부 사항 하나에서 막혀 있어서 계속하기 전에 먼저 확인하고 싶어요.','가장 좋은 부분은 그대로 두고 지금 결과에 실제로 영향을 주는 부분만 수정할게요.','더 완성돼 보이게 하려고 필요 없는 걸 추가하고 싶지는 않아요.','핵심 판단은 그대로고, 새로 고려해야 할 세부 사항 하나가 생겼어요.','부차적인 정보를 걷어내면 실제로 결정해야 할 건 하나뿐이에요. 저는 그걸 먼저 해결하는 게 좋다고 봐요.'],
 turns:{ja:['分かりました。','そこを確認しましょう。','ありがとうございます。','では、その方針で進めてください。','了解です。'],ko:['알겠습니다.','그 부분을 확인해 보죠.','감사합니다.','그 방향으로 진행해 주세요.','좋아요.'],zh:['明白。','先确认这个。','谢谢。','就按这个方向继续。','好。']}
},
{
 scenario:'分歧、边界与修复',track:'native',register:'成熟自然口语',
 sem:[
  ['我不太同意。','I do not really agree.'],['我想先停一下。','I would like to pause for a moment.'],['我更希望不要这样做。','I would rather we did not do that.'],['我觉得我们刚才有点误会。','I think we misunderstood each other a little.'],['我理解你的意思，但我还是有不同看法。','I understand your point, but I still see it differently.'],['我不是想把事情搞大，只是希望把界限说清楚。','I am not trying to make this bigger. I just want to make the boundary clear.'],['我愿意继续讨论，不过我不想在这个前提下继续。','I am happy to keep discussing it, but I do not want to continue on that assumption.'],['我刚才的表达可能太直接了，我想重新说得准确一点。','What I said may have sounded too direct. Let me put it more accurately.'],['我们不一定要在观点上完全一致，但至少可以先把事实和感受分开。','We do not have to agree completely, but we can at least separate the facts from how we feel about them.'],['我不想争输赢；我更在意的是，我们能不能找到一个双方都能接受、又不会掩盖真实分歧的做法。','I am not interested in winning the argument. What matters more is whether we can find an approach we can both accept without pretending the real disagreement is not there.']
 ],
 ja:['私はあまりそうは思いません。','いったん少し止めたいです。','できれば、それはしないでほしいです。','さっき少し認識がずれていた気がします。','言いたいことは分かりますが、それでも私は少し違う見方をしています。','話を大きくしたいわけではなくて、境界だけははっきりさせておきたいです。','話し合いは続けたいですが、その前提のまま進めるのは避けたいです。','さっきの言い方は少し直接的すぎたかもしれません。もう少し正確に言い直します。','意見が完全に一致する必要はないと思いますが、少なくとも事実と感情は分けて考えられると思います。','勝ち負けを決めたいわけではありません。本当の違いをごまかさずに、お互いが受け入れられるやり方を見つけられるかのほうが大事です。'],
 ko:['저는 그렇게 생각하지는 않아요.','잠깐 멈추고 싶어요.','가능하면 그렇게 하지는 않았으면 좋겠어요.','아까 서로 조금 다르게 이해한 것 같아요.','무슨 말씀인지는 이해하지만 저는 여전히 조금 다르게 봐요.','일을 크게 만들려는 건 아니고, 경계는 분명하게 해두고 싶어요.','대화는 계속하고 싶지만 그 전제를 그대로 둔 채 진행하고 싶지는 않아요.','아까 제 표현이 너무 직접적이었을 수도 있어요. 좀 더 정확하게 다시 말해 볼게요.','의견이 완전히 같을 필요는 없지만 적어도 사실과 감정은 나눠서 볼 수 있다고 생각해요.','누가 이기는지가 중요한 건 아니에요. 실제 차이를 없는 것처럼 만들지 않으면서도 둘 다 받아들일 수 있는 방법을 찾는 게 더 중요해요.'],
 turns:{ja:['分かりました。','その点は尊重します。','ありがとうございます。','では、そこを分けて考えましょう。','それなら話せそうです。'],ko:['알겠습니다.','그 부분은 존중할게요.','감사합니다.','그럼 그 부분을 나눠서 생각해 보죠.','그렇게 하면 얘기할 수 있을 것 같아요.'],zh:['明白。','这个边界我会尊重。','谢谢。','那我们把这两件事分开。','这样就能继续谈。']}
},
{
 scenario:'叙述、观点与细腻表达',track:'native',register:'高阶但不书面',
 sem:[
  ['我觉得挺好的。','I think it is pretty good.'],['我更喜欢前一个。','I prefer the first one.'],['我以前经常这样，现在少了。','I used to do that a lot, but not as much now.'],['一开始我不喜欢，后来慢慢习惯了。','I did not like it at first, but I gradually got used to it.'],['我觉得主要不是结果，而是整个过程让我改变了看法。','I think it was not mainly the result; the process changed how I saw it.'],['如果一定要选，我会偏向前者，不过差距没有那么大。','If I had to choose, I would lean toward the first one, although the difference is not huge.'],['我能理解为什么有人会喜欢它，只是对我来说优先级不一样。','I can see why some people like it; my priorities are just different.'],['真正让我改变主意的不是某一个瞬间，而是几个小事情累积起来。','What changed my mind was not one particular moment, but several small things adding up.'],['我不太愿意把它说成绝对的好或坏；更准确地说，它在某些条件下特别适合，但换个场景就未必。','I would not describe it as simply good or bad. More accurately, it works very well under certain conditions but not necessarily in another context.'],['如果把情绪和第一印象先放到一边，我现在更在意的是它长期是否可持续，而不是短期看起来有多漂亮。','If I put emotion and first impressions aside, what matters more to me now is whether it is sustainable over time, not how impressive it looks in the short term.']
 ],
 ja:['けっこういいと思います。','私は前のほうが好きです。','前はよくやっていましたが、今はそこまでではありません。','最初は好きじゃなかったんですが、だんだん慣れてきました。','結果そのものより、その過程で見方が変わったことのほうが大きかったと思います。','どちらか選ぶなら前のほうですが、そこまで大きな差ではないと思います。','好きな人がいるのは分かります。ただ、私の場合は優先するものが少し違います。','考えが変わったのは一つの出来事がきっかけというより、小さなことがいくつか積み重なったからです。','単純に良いか悪いかで言いたくはありません。正確には、ある条件ではすごく合うけれど、状況が変わればそうとは限らないと思います。','感情や第一印象をいったん外して考えると、今は短期的にどれだけ良く見えるかより、長く続けられるかどうかのほうを重視しています。'],
 ko:['꽤 괜찮은 것 같아요.','저는 앞의 게 더 좋아요.','예전에는 자주 했는데 지금은 그렇게 많이 하지는 않아요.','처음에는 별로였는데 점점 익숙해졌어요.','결과 자체보다 그 과정을 겪으면서 제 생각이 바뀐 게 더 컸던 것 같아요.','꼭 하나를 고르라면 앞쪽이지만 차이가 그렇게 크지는 않아요.','왜 좋아하는 사람이 있는지는 이해해요. 다만 저한테 중요한 우선순위가 조금 다른 거예요.','제 생각을 바꾼 건 어떤 한 순간이라기보다 작은 일들이 여러 번 쌓인 결과였어요.','그걸 단순히 좋다 나쁘다고 말하고 싶지는 않아요. 더 정확히 말하면 어떤 조건에서는 아주 잘 맞지만 상황이 달라지면 꼭 그렇지는 않아요.','감정과 첫인상을 잠시 빼고 보면 지금은 단기적으로 얼마나 좋아 보이는지보다 장기적으로 지속 가능한지가 더 중요해요.'],
 turns:{ja:['分かります。','そういう見方もありますね。','私はそこを大事にしています。','なるほど。','話してみると整理できますね。'],ko:['이해해요.','그렇게 볼 수도 있겠네요.','저는 그 부분을 중요하게 생각해요.','그렇군요.','얘기해 보니까 정리가 되네요.'],zh:['我能理解。','确实也可以这样看。','我比较在意这一点。','明白。','说出来以后更清楚了。']}
}
];

const coach=(lang,text)=>{
 if(lang==='ja')return /んですが|ので|けれど|なら/.test(text)?'语流：把前半句作为铺垫轻一点，句尾保留自然下降或询问语调；不要把每个助词都读成独立重音。':'语流：日语按语块保持均匀拍感，助词轻读，长音与促音不要吞掉；敬体句尾自然收住。';
 if(lang==='ko')return /는데|지만|다면|니까/.test(text)?'语流：连接语尾不要切断，前半句轻带过去，信息焦点放在后半句；连音按自然韩语语流处理。':'语流：韩语不要逐字读，助词与语尾弱化连接；注意收音与下一音节的自然连音。';
 return /不过|如果|不是|而是|更准确/.test(text)?'语流：把转折前作为铺垫，真正的新信息放在后半句；中文口语不要每个字同样重。':'语流：按意群说，虚词轻、信息词重；声调保持准确，但句子重音优先服务真实表达。'
};

export function buildAxis811Multilingual(){
 const out=[];let seq=0;
 for(const scene of SCENES){
  if(scene.sem.length!==10||scene.ja.length!==10||scene.ko.length!==10)throw new Error(`bad scene ${scene.scenario}`);
  for(let i=0;i<10;i++)for(const lang of ['ja','ko','zh']){
   const target=lang==='ja'?scene.ja[i]:lang==='ko'?scene.ko[i]:scene.sem[i][0],turns=scene.turns[lang],id=`${lang}811${String(++seq).padStart(4,'0')}`;
   out.push({id,lang,target,zh:scene.sem[i][0],en:scene.sem[i][1],scenario:scene.scenario,level:LEVELS[i],register:scene.register,track:scene.track,nativeNote:coach(lang,target),pron:coach(lang,target),response:turns[0],followup:turns[1],closing:turns[2],turn5:turns[3],turn6:turns[4],conversation:[target,...turns],alt:i<9?(lang==='ja'?scene.ja[i+1]:lang==='ko'?scene.ko[i+1]:scene.sem[i+1][0]):'',anchor:scene.scenario,mistake:lang==='ja'?'优先学真实语块与语气，不用中文语序硬套日语。':lang==='ko'?'优先掌握语尾与敬语层级，不把书面句直接当日常口语。':'保持声调准确，同时按真实意群和信息重音说，不做逐字播报。'})
  }
 }
 return out
}

export function auditAxis811Multilingual(units=buildAxis811Multilingual()){
 const per=Object.fromEntries(['ja','ko','zh'].map(l=>[l,units.filter(x=>x.lang===l).length]));
 const dup=Object.fromEntries(['ja','ko','zh'].map(l=>{const a=units.filter(x=>x.lang===l),n=x=>String(x.target).normalize('NFKC').replace(/\s+/g,' ').trim().toLowerCase();return[l,a.length-new Set(a.map(n)).size]}));
 const missing=units.filter(x=>!x.target||!x.zh||!x.en||!x.response||!x.followup||!x.closing||!x.turn5||!x.turn6||!x.pron).map(x=>x.id);
 return{count:units.length,per,dup,missing,sixTurn:units.every(x=>x.conversation?.length===6&&x.conversation.every(Boolean))}
}
