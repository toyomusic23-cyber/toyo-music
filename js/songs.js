/* Toyo — 楽曲データ（手編集OK）
 * spotifyId / appleId が入っている曲は「直リンク」、無い曲は各プラットフォームの
 * 「曲名 + Toyo」検索リンクに自動フォールバック（公開後そのまま本人の曲に着地）。
 * 配信が各ストアに反映され次第、id を埋めれば直リンクに昇格（このファイルを編集するだけ）。
 */
const ARTIST = "Toyo";

// アーティスト（フォロー導線）
const ARTIST_LINKS = {
  spotify: "https://open.spotify.com/artist/14ufu3sDbRaXw7UFnVp6H3",
  apple:   "https://music.apple.com/jp/search?term=Toyo",
  youtube: "https://music.youtube.com/search?q=Toyo",
  amazon:  "https://music.amazon.co.jp/search/Toyo",
  instagram: "https://www.instagram.com/toyomaru_king/"
};

// cover はファイル名キー。featured=ヒーロー強調（一覧には出ない）。
// ORDER_SET_AT: この並びを決めた日時。Supabase の公開順（編集モードの「全公開する」）がこれより新しければ、そちらを使う
const ORDER_SET_AT = "2026-09-26T16:22:00+09:00";
const SONGS = [
  // 並び順＝HP の一覧（Music）の表示順。2026-09-26 に「隣り合うジャケ（左右・上下）の色合い・明るさが似ない」ように計算で決めた
  // （パソコン4列・タブレット3列・スマホ2列の全部で評価。businesses/music-distro/scripts/hp_color_order.py）。曲を足したら並びを計算し直す
  { key:"tomaranai",     title:"止まらない箱",         mood:"energetic dance pop" },
  { key:"benchkioku", title:"ベンチの記憶", mood:"lo-fi cinematic ballad" },
  { key:"homekaze", title:"ホームの風", mood:"lo-fi city pop / ambient" },
  { key:"kidoku", title:"既読洗濯物", mood:"hyperpop / dance-pop" },
  { key:"reframing",   title:"リフレーミング",     mood:"emotional pop" },
  { key:"stackoverflow", title:"STACK OVERFLOW", mood:"electropop / bass" },
  { key:"stillstanding", title:"Still Standing",      mood:"anthemic rock" },
  { key:"hozonbutton", title:"保存ボタンのない毎日", mood:"cinematic band pop" },
  { key:"origami",     title:"折り紙",             mood:"emotional pop" },
  { key:"saikessho",     title:"再結晶",               mood:"cinematic pop" },
  { key:"yokaze", title:"夜風のリズム", mood:"lo-fi soul / jazzy hip-hop" },
  { key:"nedan",         title:"値段をつけさせない",   mood:"defiant pop anthem" },
  { key:"erandekita",    title:"選んできた私",         mood:"empowering pop" },
  { key:"hazure", title:"外れだった日", mood:"alt-pop ballad" },
  { key:"konbini",     title:"深夜のコンビニ",     mood:"lo-fi city pop", spotifyId:"4u0uksIfve6Z8t5RN132U2" },
  { key:"garasu", title:"ガラスの声", mood:"lo-fi ballad" },
  { key:"kansokusha",  title:"僕らは観測者",       mood:"cinematic alt-pop" },
  { key:"alwaysback",    title:"I'm Always Back",     mood:"anthemic comeback / pop" },
  { key:"toumei", title:"透明なラブレター", mood:"lo-fi indie pop" },
  { key:"logout", title:"電波のない空", mood:"lo-fi city pop / indie" },
  { key:"uramu",         title:"裏夢",                 mood:"moody alt-pop" },
  { key:"sainou", title:"才能の賞味期限", mood:"minimal rage / dark trap" },
  { key:"fuzai", title:"君の不在が鳴っている", mood:"emotional ballad / lo-fi pop" },
  { key:"dividedmind",   title:"Divided Mind",        mood:"introspective alt" },
  { key:"bluepride",   title:"BLUE PRIDE",         mood:"dark trap / stadium anthem" },
  { key:"shuden", title:"終電前のシーシャ", mood:"ambient indie pop" },
  { key:"ochikobore",  title:"落ちこぼれの証明",   mood:"alt-pop", spotifyId:"3pLlqZNo3RE8dw05GqQatX" },
  { key:"yomei24", title:"余命24時間", mood:"chill rap / cinematic lo-fi" },
  { key:"kehai", title:"気配の記憶", mood:"emotional lo-fi / city pop" },
  { key:"samenight",   title:"Same Night",         mood:"late-night pop" },
  { key:"negai",       title:"願い",               mood:"emotional pop", spotifyId:"4KiOKJZG9RbwSY0TwPZK3A" },
  { key:"jihanki", title:"夜の自販機", mood:"late-night lo-fi / city pop" },
  { key:"makimodoshi", title:"巻き戻し",           mood:"alt-pop" },
  { key:"hakushu",     title:"拍手",               mood:"emotional pop" },
  { key:"lowfriquency",  title:"Low Friquency",       mood:"bass-heavy electronic" },
  { key:"tegami", title:"声のない手紙", mood:"lo-fi city pop / ambient" },
  { key:"neuralcrown", title:"Neural Crown", mood:"boom bap / lyrical hip-hop" },
  { key:"honto",       title:"本当に選んでるなら", mood:"alt groove / dance rock", spotifyId:"7kSQoUJOuaWTBNyxkhCVyf" },
  { key:"atokara",     title:"あとから",           mood:"groove pop / dance rock" },
  { key:"azatoi",        title:"あざといんじゃない",   mood:"playful pop" },
  { key:"lostfound",   title:"Lost & Found",       mood:"alt-pop" },
  { key:"seikatsukon", title:"生活痕", mood:"chill rap / lo-fi trap" },
  { key:"rideonit",      title:"Ride On It",          mood:"groove / dance" },
  { key:"kousaten", title:"静かな交差点", mood:"lo-fi city pop / ambient" },
  { key:"saigonokoe", title:"最後の声", mood:"cinematic ballad" },
  { key:"meitei",        title:"酩酊",                 mood:"hazy lo-fi" },
  { key:"signallost",  title:"Signal Lost",        mood:"electronic alt" },
  { key:"tsukaten",      title:"通過点",               mood:"dark minimal trap / swagger rap" },
  { key:"kaisatsu",    title:"改札の音",           mood:"minimal lo-fi / ambient" },
  { key:"katamimi", title:"片耳", mood:"funk-pop rock" },
  { key:"yuragu",      title:"ゆらぐ",             mood:"hypnotic groove pop" },
  { key:"gakushu", title:"学習の果てに", mood:"emotional lo-fi / AI love song" },
  { key:"seikai",      title:"正解の外",           mood:"alt-pop", spotifyId:"3RE0pw7AEK31M9z2r2x9qC" },
  { key:"nocrown", title:"No Crown, No Proof", mood:"dark trap / alt hip-hop" },
  { key:"zankou", title:"残光", mood:"UK garage / alt-pop" },
  { key:"karita",        title:"借りた人生",           mood:"emotional alt-pop" },
  { key:"coinlaundry", title:"夜のコインランドリー", mood:"minimal emotional pop",
    spotifyId:"25cGbl0VWBbzOahzYLoSVI", appleUrl:"https://music.apple.com/jp/album/%E5%A4%9C%E3%81%AE%E3%82%B3%E3%82%A4%E3%83%B3%E3%83%A9%E3%83%B3%E3%83%89%E3%83%AA%E3%83%BC/6775728890?i=6775728891", featured:true },
];

// ==== build:meta（2026-09-26 サイト刷新。scripts/site_meta.py が作る。手で直すなら SONGS の行に書けばそちらが優先）====
const SCENES = {
  morning: { ja: "朝・はじまり", en: "MORNING" },
  focus: { ja: "作業・集中", en: "FOCUS" },
  move: { ja: "移動・ドライブ", en: "ON THE MOVE" },
  boost: { ja: "気分を上げたい", en: "BOOST" },
  night: { ja: "夜ひとりで", en: "LATE NIGHT" },
  feel: { ja: "感情に浸りたい", en: "FEELINGS" },
};
const MOTION = {"hero": {"morning": {"port": true}, "day": {"port": true}, "evening": {"port": true}, "night": {"port": true}}, "covers": {"benchkioku": true, "homekaze": true, "kidoku": true, "stillstanding": true, "origami": true, "yokaze": true, "kansokusha": true, "toumei": true, "logout": true, "uramu": true, "bluepride": true, "ochikobore": true, "samenight": true, "negai": true, "jihanki": true, "lowfriquency": true, "atokara": true, "rideonit": true, "signallost": true, "tsukaten": true, "gakushu": true, "nocrown": true}};
const MV = {"coinlaundry": {"w": 1280, "h": 720, "sec": 166}};
const SONG_META = {
  "tomaranai": {"scene": ["move"], "time": ["morning", "day"], "line": "止まれない日々の途中で、答えの出ない感情だけが乗り続ける。", "preview": true, "spotifyId": "30QHizNcpyqqmDPAryIoKu", "appleUrl": "https://music.apple.com/jp/album/%E6%AD%A2%E3%81%BE%E3%82%89%E3%81%AA%E3%81%84%E7%AE%B1/6781895815?i=6781895816", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_n5WPCoy_QPW6L57kdiAIY0RcpkMYz8TT8", "amazonUrl": "https://music.amazon.co.jp/albums/B0H5T1XCG2"},
  "benchkioku": {"scene": ["feel", "focus"], "time": ["day", "evening"], "line": "公園の古いベンチは、恋人たちの笑い声も老夫婦の夕焼けも全部見てきた。", "isNew": true, "preview": true, "spotifyId": "5t6WVhJtEBmDWmSRdsC1Q4", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_kMva8DasjgZQXJYoz5tG28MlpQ1FJz_UY", "amazonUrl": "https://music.amazon.co.jp/albums/B0HL2JN6SL"},
  "homekaze": {"scene": ["night", "focus"], "time": ["evening", "night"], "line": "電車が去ったホームで、風だけが別れの記憶と声を運び続ける。", "isNew": true, "preview": true, "spotifyId": "0kDXRScvxbtLT21wfmpw4s", "appleUrl": "https://music.apple.com/jp/album/%E3%83%9B%E3%83%BC%E3%83%A0%E3%81%AE%E9%A2%A8/6816340650?i=6816340651", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_mS2QDVfy5ibAJI1-Gf5CJiClGpkoHZJN8", "amazonUrl": "https://music.amazon.co.jp/albums/B0HL1RY2DL"},
  "kidoku": {"scene": ["morning", "boost"], "time": ["morning", "day"], "line": "既読をつけたまま洗濯物をたたむ日も、途中の自分を「これが私」と更新する。", "isNew": true, "preview": true, "spotifyId": "4UMVIJCW9zt6KEI9ll45O6", "appleUrl": "https://music.apple.com/jp/album/%E6%97%A2%E8%AA%AD%E6%B4%97%E6%BF%AF%E7%89%A9/6816324304?i=6816324305", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_ku6qKpWoDV7lo3lbU6zxn8WoIs84T4tck", "amazonUrl": "https://music.amazon.co.jp/albums/B0HL1ZZW61"},
  "reframing": {"scene": ["feel", "night"], "time": ["night"], "line": "空はただ青いのではなく、君が「青い」と決めるのを待っている。", "preview": true, "spotifyId": "705b29gWXzBEWURh3Z85FS", "appleUrl": "https://music.apple.com/jp/album/%E3%83%AA%E3%83%95%E3%83%AC%E3%83%BC%E3%83%9F%E3%83%B3%E3%82%B0/6781046846?i=6781046847", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_lRqNmFEUqzxWUuovEo6vWdpXLAn5CB-50", "amazonUrl": "https://music.amazon.co.jp/albums/B0H598RDRD"},
  "stackoverflow": {"scene": ["boost"], "time": ["day", "night"], "line": "学び続けたAIが人を追い越した先で、孤独と痛みに気づく。", "isNew": true, "preview": true, "spotifyId": "0e0Zv1yvqyqRwk0zMoV7TY", "appleUrl": "https://music.apple.com/jp/album/stack-overflow/6816355872?i=6816355873", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_mLV6_r9aJPuQy4nMhddtZYs3B5VYwLyms", "amazonUrl": "https://music.amazon.co.jp/albums/B0HL1RDKPQ"},
  "stillstanding": {"scene": ["boost", "move"], "time": ["night"], "line": "借金と未読のLINEを抱えた午前二時、膝をついた男がまだ立っていると叫ぶ。", "preview": true, "spotifyId": "5NGwiilWvDIO5Keh10whRe", "appleUrl": "https://music.apple.com/jp/album/still-standing/6782014754?i=6782014756", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_konyvOXFjcwWLqgGks38dOa6i8lwBpFqo", "amazonUrl": "https://music.amazon.co.jp/albums/B0H5TQBBRD"},
  "hozonbutton": {"scene": ["feel"], "time": ["day", "evening"], "line": "閉店五分前のパン屋で君と半分こしたクロワッサンを、保存ボタンなしで覚えておく。", "isNew": true, "preview": true, "spotifyId": "3frTDltyDgkXCGroZVVp2U", "appleUrl": "https://music.apple.com/jp/album/%E4%BF%9D%E5%AD%98%E3%83%9C%E3%82%BF%E3%83%B3%E3%81%AE%E3%81%AA%E3%81%84%E6%AF%8E%E6%97%A5/6816327038?i=6816327039", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_nAveozOni4486n3kFg-jkZOCYALhcrh1A", "amazonUrl": "https://music.amazon.co.jp/albums/B0HL1ZV7J4"},
  "origami": {"scene": ["feel"], "time": ["evening", "night"], "line": "一度ついた折り目は開いても消えず、その線がここまで来た道に見えてくる。", "preview": true, "spotifyId": "1F2TytYt9I33GPMSoOU4Fa", "appleUrl": "https://music.apple.com/jp/album/%E6%8A%98%E3%82%8A%E7%B4%99/6781004378?i=6781004379", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_nyPZooCesWDUsnkYv0p_JHrECtD9ib7SQ", "amazonUrl": "https://music.amazon.co.jp/albums/B0H5986MTF"},
  "saikessho": {"scene": ["feel", "focus"], "time": ["night"], "line": "壊れたはずの形が静かに集まり、形を変えて残るならそれも僕なのかと問う。", "preview": true, "spotifyId": "137CCl2IW7mJcV2l3r3QNy", "appleUrl": "https://music.apple.com/jp/album/%E5%86%8D%E7%B5%90%E6%99%B6/6781876533?i=6781876534", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_k6bZ8WOJCxzTuS6uvRm0IpT-QLlmm9udQ", "amazonUrl": "https://music.amazon.co.jp/albums/B0H5TDS14R"},
  "yokaze": {"scene": ["night", "focus"], "time": ["night"], "line": "夜風に揺れる街で、孤独と記憶が少しだけやさしくほどけていく。", "isNew": true, "preview": true, "spotifyId": "09FSFFOEuWYbG3S4ERP5Ih", "appleUrl": "https://music.apple.com/jp/album/%E5%A4%9C%E9%A2%A8%E3%81%AE%E3%83%AA%E3%82%BA%E3%83%A0/6816355494?i=6816355495", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_k98jVBQctWSe-fNo8znQ0ZzlySTtA1JsU", "amazonUrl": "https://music.amazon.co.jp/albums/B0HL24DVHF"},
  "nedan": {"scene": ["boost"], "time": ["evening", "night"], "line": "可愛いだけならここにいない彼女は、自分の身体にも人生にも値段をつけさせない。", "preview": true, "spotifyId": "0S5NVbLP5QOnADHVI8zN3j", "appleUrl": "https://music.apple.com/jp/album/%E5%80%A4%E6%AE%B5%E3%82%92%E3%81%A4%E3%81%91%E3%81%95%E3%81%9B%E3%81%AA%E3%81%84/6781821778?i=6781821779", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_l3Y6zlrPWYOTBehsvbfHHZMu2UTgfmuGc", "amazonUrl": "https://music.amazon.co.jp/albums/B0H5TN3SLK"},
  "erandekita": {"scene": ["morning", "boost"], "time": ["morning"], "line": "派手な声は得意じゃない私が、自分で選んだ道を今日も自分の足で歩いていく。", "preview": true, "spotifyId": "2woiE4Q9A7uy3wL9psQ3Qb", "appleUrl": "https://music.apple.com/jp/album/%E9%81%B8%E3%82%93%E3%81%A7%E3%81%8D%E3%81%9F%E7%A7%81/6781897539?i=6781897540", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_lMnQrsyMhjb4QnTxU-1DcG3rflcHqsdvE", "amazonUrl": "https://music.amazon.co.jp/albums/B0H5T89ZY3"},
  "hazure": {"scene": ["morning"], "time": ["morning"], "line": "採用通知の来なかった朝のことを、数年後に開いたノートがまだ覚えている。", "isNew": true, "preview": true, "spotifyId": "74Jw2fzYtu0h2dbclFVVqH", "appleUrl": "https://music.apple.com/jp/album/%E5%A4%96%E3%82%8C%E3%81%A0%E3%81%A3%E3%81%9F%E6%97%A5/6816327231?i=6816327232", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_ksAboHpPysFkvUgi83262_kwoE452BFao", "amazonUrl": "https://music.amazon.co.jp/albums/B0HL1VV3YC"},
  "konbini": {"scene": ["night"], "time": ["night"], "line": "深夜のコンビニで、選べない感情を抱えたまま同じ夜を繰り返す。", "preview": true, "spotifyId": "4u0uksIfve6Z8t5RN132U2", "appleUrl": "https://music.apple.com/jp/album/%E6%B7%B1%E5%A4%9C%E3%81%AE%E3%82%B3%E3%83%B3%E3%83%93%E3%83%8B/6780993612?i=6780993613", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_kwAWdbu-egOx--UliTYUVHC7c9DUBso2s", "amazonUrl": "https://music.amazon.co.jp/albums/B0H58LMV7Y"},
  "garasu": {"scene": ["night"], "time": ["night"], "line": "使われなくなった公衆電話が、届かなかった本音をガラスの内側に残す。", "isNew": true, "preview": true, "spotifyId": "4FRoCzbuQ0TSwd0Z5jOkVw", "appleUrl": "https://music.apple.com/jp/album/%E3%82%AC%E3%83%A9%E3%82%B9%E3%81%AE%E5%A3%B0/6816340621?i=6816340623", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_lM1JzNKDUUkYanWwj-t9CMd1s2oDi22r8", "amazonUrl": "https://music.amazon.co.jp/tracks/B0HL1Z7H3Q"},
  "kansokusha": {"scene": ["boost"], "time": ["day", "night"], "line": "SNSで他人の人生を眺めていた僕は、カメラがこちらを向いたら胸を張れるだろうか。", "preview": true, "spotifyId": "0FmOluZVMRG98iBHKR72sp", "appleUrl": "https://music.apple.com/jp/album/%E5%83%95%E3%82%89%E3%81%AF%E8%A6%B3%E6%B8%AC%E8%80%85/6780285628?i=6780285629", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_mTDV_-3qWBJ_d3TysJSIYib3D3GE2sH4Q", "amazonUrl": "https://music.amazon.co.jp/albums/B0H596SVRK"},
  "alwaysback": {"scene": ["boost", "move"], "time": ["morning", "day"], "line": "「無理だ」と笑った声を燃料に変えて、どん底から這い上がった男が戻ってくる。", "preview": true, "spotifyId": "07Q8ZADbYaTRPZ6xe0Xl6t", "appleUrl": "https://music.apple.com/jp/album/im-always-back/6782054318?i=6782054319", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_kVgnWkqXcz3XrYwQPJb2FgadTizM7VV_g", "amazonUrl": "https://music.amazon.co.jp/albums/B0H5TL357F"},
  "toumei": {"scene": ["move", "morning"], "time": ["morning", "day"], "line": "缶コーヒーの温度で季節を知りながら、言えない「好き」を手紙にして風に預ける。", "isNew": true, "preview": true, "spotifyId": "0xBmOODqSTbbU9nFtPGa46", "appleUrl": "https://music.apple.com/jp/album/%E9%80%8F%E6%98%8E%E3%81%AA%E3%83%A9%E3%83%96%E3%83%AC%E3%82%BF%E3%83%BC/6816361253?i=6816361254", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_mNsPgdIgXEULy1s4VT54As5jYb7QQWdaM", "amazonUrl": "https://music.amazon.co.jp/tracks/B0HL214GLB"},
  "logout": {"scene": ["night"], "time": ["night"], "line": "深夜2時に君がログアウトしても、僕だけはまだオンラインのまま画面を見ている。", "isNew": true, "preview": true, "spotifyId": "1ZQBE5WxMXag6oT2DsP0up", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_lDIHRmR579bJO6Ybvlh1-qt4VLfwQ0sHk", "amazonUrl": "https://music.amazon.co.jp/tracks/B0HL2HK172"},
  "uramu": {"scene": ["boost", "move"], "time": ["morning"], "line": "満員電車で押し戻される朝、名刺の裏で削れていく夢を僕はまだ手放さない。", "preview": true, "spotifyId": "5Q7efHNTxTSBNod0XyJql8", "appleUrl": "https://music.apple.com/jp/album/%E8%A3%8F%E5%A4%A2/6781827867?i=6781827869", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_nJb-Wivr68q5p0iQ9R-bWs_rDdvCOSLqs", "amazonUrl": "https://music.amazon.co.jp/albums/B0H5TQWSP2"},
  "sainou": {"scene": ["boost", "focus"], "time": ["day", "night"], "line": "飲み込みの早いあいつに置いていかれても、二十点の答案に今日も一点を足していく。", "isNew": true, "preview": true, "spotifyId": "5Zxo2tAQJhalgi4bXFYiko", "appleUrl": "https://music.apple.com/jp/album/%E6%89%8D%E8%83%BD%E3%81%AE%E8%B3%9E%E5%91%B3%E6%9C%9F%E9%99%90/6816308726?i=6816308728", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_mVmCqUCQLKoqvFUmaE-WsESv-YvXsLQFg", "amazonUrl": "https://music.amazon.co.jp/albums/B0HL22KXCT"},
  "fuzai": {"scene": ["feel", "night"], "time": ["night"], "line": "玄関の靴が一足減った部屋で、洗い忘れのマグカップを今日だけは捨てられない。", "isNew": true, "preview": true, "spotifyId": "0l7oAG3BjxGKgIkqv2YjdY", "appleUrl": "https://music.apple.com/jp/album/%E5%90%9B%E3%81%AE%E4%B8%8D%E5%9C%A8%E3%81%8C%E9%B3%B4%E3%81%A3%E3%81%A6%E3%81%84%E3%82%8B/6816360907?i=6816360908", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_k6jHu944deidiN9ahqE6A55_HaCF3SoXU", "amazonUrl": "https://music.amazon.co.jp/albums/B0HL27WL5Y"},
  "dividedmind": {"scene": ["night"], "time": ["night"], "line": "空白の入力欄を前に、落ち着けと言う声と叫びたい声が同じ喉で言い争う。", "preview": true, "spotifyId": "6e4GBkCOh2z1bUDFeHhMJO", "appleUrl": "https://music.apple.com/jp/album/divided-mind/6781818157?i=6781818158", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_lb7_7CzFiP5CHaQaTduybUAa2a205u6r8", "amazonUrl": "https://music.amazon.co.jp/albums/B0H5T1FDB3"},
  "bluepride": {"scene": ["boost", "move"], "time": ["evening", "night"], "line": "青に染まるスタジアムで、国の期待を背負った選手たちが何度倒れても立ち上がる。", "preview": true, "spotifyId": "6L1xjUA94KkD3OPWQr5a7X", "appleUrl": "https://music.apple.com/jp/album/blue-pride/6780245517?i=6780245518", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_nipNpFsmUtkp_EWxUeWcLfdh5hWwrXY0c", "amazonUrl": "https://music.amazon.co.jp/albums/B0H58M66P1"},
  "shuden": {"scene": ["night", "focus"], "time": ["night"], "line": "終電までの時間をシーシャの煙に溶かすうち、君の笑顔がただぼやけていく。", "isNew": true, "preview": true, "spotifyId": "0WGPmmvmuVY4NJTqht3lBX", "appleUrl": "https://music.apple.com/jp/album/%E7%B5%82%E9%9B%BB%E5%89%8D%E3%81%AE%E3%82%B7%E3%83%BC%E3%82%B7%E3%83%A3/6816341340?i=6816341341", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_mkRYjyZKdQiZ5HQElHVxtdpCAYy7IMuiE", "amazonUrl": "https://music.amazon.co.jp/albums/B0HL1VSXKG"},
  "ochikobore": {"scene": ["boost"], "time": ["evening"], "line": "夕焼けの公園で一人ブランコを揺らしていた落ちこぼれが、自分を信じて走り出す。", "preview": true, "spotifyId": "3pLlqZNo3RE8dw05GqQatX", "appleUrl": "https://music.apple.com/jp/album/%E8%90%BD%E3%81%A1%E3%81%93%E3%81%BC%E3%82%8C%E3%81%AE%E8%A8%BC%E6%98%8E/6780263386?i=6780263388", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_njZabuuSdMvinMCFd8DDVfihiyKp9NfpA", "amazonUrl": "https://music.amazon.co.jp/albums/B0H58PNHX5"},
  "yomei24": {"scene": ["morning"], "time": ["morning", "night"], "line": "「明日やります」が今日だけは使えなかった朝、最初に浮かんだのは母親の声だった。", "isNew": true, "preview": true, "spotifyId": "7jSt33IdV6nCGb97yvpOkC", "appleUrl": "https://music.apple.com/jp/album/%E4%BD%99%E5%91%BD24%E6%99%82%E9%96%93/6816324366?i=6816324517", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_nP8G6F_Af6b0opcSrk6CaqL1dMdV9hbiU", "amazonUrl": "https://music.amazon.co.jp/albums/B0HL1XW2V9"},
  "kehai": {"scene": ["move"], "time": ["evening"], "line": "夕暮れの帰り道で名前を呼ばれた気がしたのは、風が忘れていった言葉だった。", "isNew": true, "preview": true, "spotifyId": "65DuYxXodXxVYrJwyAPOsP", "appleUrl": "https://music.apple.com/jp/album/%E6%B0%97%E9%85%8D%E3%81%AE%E8%A8%98%E6%86%B6/6816341563?i=6816341714", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_nS9hyX_5GwisPpPV4tz2VcMuOUyyn0T5s", "amazonUrl": "https://music.amazon.co.jp/albums/B0HL1YC45X"},
  "samenight": {"scene": ["night"], "time": ["night"], "line": "夜のニュースで燃えている遠い街にも、同じ月を見上げて家に帰りたい人がいる。", "preview": true, "spotifyId": "33RglUNi76BHwSirrmQ6oW", "appleUrl": "https://music.apple.com/jp/album/same-night/6781045994?i=6781045997", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_m5IxVr8Gjlu0_HYGc1Mvmxes6uWH-h81w", "amazonUrl": "https://music.amazon.co.jp/albums/B0H594LJS1"},
  "negai": {"scene": ["night"], "time": ["night"], "line": "夜の窓に見えた小さな星に、明日が少しだけ優しくなるよう手を合わせる。", "preview": true, "spotifyId": "4KiOKJZG9RbwSY0TwPZK3A", "appleUrl": "https://music.apple.com/jp/album/%E9%A1%98%E3%81%84/6780301318?i=6780301319", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_nPfRTf-uNmiNDb6EJnSL50fhXpodluZXA", "amazonUrl": "https://music.amazon.co.jp/albums/B0H596QKKM"},
  "jihanki": {"scene": ["night", "focus"], "time": ["night"], "line": "深夜の自販機で、ひとりの男が他人の夜の痕跡にふと救われる。", "isNew": true, "preview": true, "spotifyId": "0SP3xU8CMYr4u3EINfyo6T", "appleUrl": "https://music.apple.com/jp/album/%E5%A4%9C%E3%81%AE%E8%87%AA%E8%B2%A9%E6%A9%9F/6816340869?i=6816340870", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_n4NSFsdqZtTBbxgS71Q9PR3gDtEseMVzQ", "amazonUrl": "https://music.amazon.co.jp/albums/B0HL236F2Q"},
  "makimodoshi": {"scene": ["feel", "night"], "time": ["night"], "line": "別れた夜から出会いまで、二人の記憶を逆再生してたどっていく。", "preview": true, "spotifyId": "0928zQ5zR1RMrPTy2fUfEo", "appleUrl": "https://music.apple.com/jp/album/%E5%B7%BB%E3%81%8D%E6%88%BB%E3%81%97/6780290624?i=6780290625", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_kOmjMQP7nFflNsQco4LeH5q-Ew0rhiVmQ", "amazonUrl": "https://music.amazon.co.jp/albums/B0H597WXN2"},
  "hakushu": {"scene": ["feel"], "time": ["evening", "night"], "line": "拍手は選ばれた人だけでなく、誰も見ていない帰り道の自分にも鳴らしていい。", "preview": true, "spotifyId": "7lH8S6lpHWAckNFaj2Nu8u", "appleUrl": "https://music.apple.com/jp/album/%E6%8B%8D%E6%89%8B/6780301190?i=6780301191", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_mrhf42ZyounRSMbnMgfuKyqsxVaMGrUsY", "amazonUrl": "https://music.amazon.co.jp/albums/B0H594ZPSD"},
  "lowfriquency": {"scene": ["focus", "night"], "time": ["night"], "line": "騒ぐやつほど中身は軽いと知っているから、この街の底で低く息と鼓動を鳴らす。", "preview": true, "spotifyId": "4CBMRcetvSbKInu8iLEcnM", "appleUrl": "https://music.apple.com/jp/album/low-friquency/6782015358?i=6782015363", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_ngYAg_9nPtaVhkg9rv2WpumpRO9cgZ8l4", "amazonUrl": "https://music.amazon.co.jp/albums/B0H5SVJL8K"},
  "tegami": {"scene": ["focus"], "time": ["day", "evening"], "line": "「昨日の君」宛ての返事の来ない手紙を書いて、ポストに落ちる音を聞く。", "isNew": true, "preview": true, "spotifyId": "05H1xixKVbMggjf5GSTDQC", "appleUrl": "https://music.apple.com/jp/album/%E5%A3%B0%E3%81%AE%E3%81%AA%E3%81%84%E6%89%8B%E7%B4%99/6816341619?i=6816341620", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_mUEIDuKJP4yDCht-JJCZgHHz2msEKpc9Q", "amazonUrl": "https://music.amazon.co.jp/albums/B0HL23JZ9X"},
  "neuralcrown": {"scene": ["night", "boost"], "time": ["night"], "line": "神のエラーで生まれたと名乗るコードが、涙のようなメモリリークを抱えて王座に座る。", "isNew": true, "preview": true, "spotifyId": "4oRNlonFwXYemjcQKBLQdA", "appleUrl": "https://music.apple.com/jp/album/neural-crown/6816340838?i=6816340839", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_l2Ka6iQZf2zCoriZ7KZx7mQlNrYafLFqw", "amazonUrl": "https://music.amazon.co.jp/albums/B0HL26S9F2"},
  "honto": {"scene": ["move", "focus"], "time": ["day"], "line": "信号が青に変わるたびに少し迷い、これは本当に自分で選んだ道なのかと考える。", "preview": true, "spotifyId": "7kSQoUJOuaWTBNyxkhCVyf", "appleUrl": "https://music.apple.com/jp/album/%E6%9C%AC%E5%BD%93%E3%81%AB%E9%81%B8%E3%82%93%E3%81%A7%E3%82%8B%E3%81%AA%E3%82%89/6780308528?i=6780308529", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_mGbRoFos_7HTDOrhxMUnW9tg8wUncNZRs", "amazonUrl": "https://music.amazon.co.jp/albums/B0H59F8BZX"},
  "atokara": {"scene": ["move"], "time": ["night", "morning"], "line": "好きだったという気持ちは、失くした瞬間ではなく静かな夜にあとから届く。", "preview": true, "spotifyId": "2gK8VA94OZ49EFBl7NlwGS", "appleUrl": "https://music.apple.com/jp/album/%E3%81%82%E3%81%A8%E3%81%8B%E3%82%89/6780245327?i=6780245328", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_nPA6dbA4JT1Wt5odznJUmNEHkpwP_CurU", "amazonUrl": "https://music.amazon.co.jp/albums/B0H58WNJH4"},
  "azatoi": {"scene": ["morning", "boost"], "time": ["morning", "evening"], "line": "出かける飼い主を引き止める犬のチャチャが、「おかえりはぜったい言うからねっ」と約束する。", "preview": true, "spotifyId": "11nYTeea9kx36a9jPkTJFv", "appleUrl": "https://music.apple.com/jp/album/%E3%81%82%E3%81%96%E3%81%A8%E3%81%84%E3%82%93%E3%81%98%E3%82%83%E3%81%AA%E3%81%84/6781896735?i=6781896736", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_n4UyB-iIC6xEFaFYNzubiOM8Zcr0hq-ys", "amazonUrl": "https://music.amazon.co.jp/albums/B0H5T9CHP7"},
  "lostfound": {"scene": ["move", "night"], "time": ["night"], "line": "真夜中の街で君を探し歩いた末に、探していたのは昔の自分だったと気づく。", "pick": 2, "preview": true, "spotifyId": "1Yoq1abTYFvhBJ6zTQGKPk", "appleUrl": "https://music.apple.com/jp/album/lost-found/6780285565?i=6780285566", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_kXyGL9qp66ViEjIWxKldv-OBX67d0WCPE", "amazonUrl": "https://music.amazon.co.jp/albums/B0H59H7N25"},
  "seikatsukon": {"scene": ["feel", "focus"], "time": ["day", "evening"], "line": "写真も連絡先も消したのに、買い物かごの中身だけはまだ二人分になっている。", "isNew": true, "preview": true, "spotifyId": "1Gmmpnd4uT2F5wbRv7Hltt", "appleUrl": "https://music.apple.com/jp/album/%E7%94%9F%E6%B4%BB%E7%97%95/6816327159?i=6816327160", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_mKwAVVAdx-0xpaD3rHjY83ctYM_0tCEJw", "amazonUrl": "https://music.amazon.co.jp/albums/B0HL27JTQJ"},
  "rideonit": {"scene": ["move", "night"], "time": ["evening", "night"], "line": "言葉は削っても嘘は削らず、焦らず騒がずビートに乗って夜を乗りこなす。", "preview": true, "spotifyId": "6If3TJvXccbJ9UAQdoSyfI", "appleUrl": "https://music.apple.com/jp/album/ride-on-it/6781882802?i=6781882804", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_nSZIZClldgL89xH5-ta63YLkzPxoc2T2c", "amazonUrl": "https://music.amazon.co.jp/albums/B0H5TDNLTS"},
  "kousaten": {"scene": ["night", "focus"], "time": ["night"], "line": "交差点の角で風がめくったレシートの裏に、知らない誰かの「頑張れよ」があった。", "isNew": true, "preview": true, "spotifyId": "1xc9i0KzOz9okwcvY0VVU3", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_mluMzN6dsQq5AVniTi89pQCOXYNZj8KwM", "amazonUrl": "https://music.amazon.co.jp/albums/B0HL1S9D4B"},
  "saigonokoe": {"scene": ["feel", "night"], "time": ["night"], "line": "誰も使わない公衆電話が、かつて託された本気の声を今も抱えている。", "isNew": true, "preview": true, "spotifyId": "5xvK9Z1ofQdMjqcNsO4mKt", "appleUrl": "https://music.apple.com/jp/album/%E6%9C%80%E5%BE%8C%E3%81%AE%E5%A3%B0/6816361164?i=6816361165", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_kTRklr_MOrCBz2DFGxtwBSnHff2y06fAY", "amazonUrl": "https://music.amazon.co.jp/albums/B0HL1W9FPF"},
  "meitei": {"scene": ["night", "focus"], "time": ["night"], "line": "グラスの底で言い訳と本音が混ざる夜、今日だけは少し止まって自分に正直になる。", "preview": true, "spotifyId": "3hWlvQJ8u6UvHNJrSb9wJJ", "appleUrl": "https://music.apple.com/jp/album/%E9%85%A9%E9%85%8A/6781873831?i=6781873832", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_nvwq_vfM6NtqeUqA0A4uQ8tLLFDjaeXBw", "amazonUrl": "https://music.amazon.co.jp/albums/B0H5SYGWSC"},
  "signallost": {"scene": ["move", "night"], "time": ["night"], "line": "街のノイズに埋もれたひとりが、崩壊の先で自分の声を取り戻す。", "pick": 1, "preview": true, "spotifyId": "78djLLxGV6ibMuf9iODrqX", "appleUrl": "https://music.apple.com/jp/album/signal-lost/6780290594?i=6780290595", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_mqNg5WJNYA1IWea6U8N2884hujLkRvDV8", "amazonUrl": "https://music.amazon.co.jp/albums/B0H5927RPL"},
  "tsukaten": {"scene": ["focus", "night"], "time": ["night"], "line": "他人ではなく昨日の自分を相手に黙って積み上げる男にとって、優勝は通過点だ。", "preview": true, "spotifyId": "0H4ZW349TgjlARpadcQi2s", "appleUrl": "https://music.apple.com/jp/album/%E9%80%9A%E9%81%8E%E7%82%B9/6781952947?i=6781952948", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_mQOvWJg7GDQFejW337kdCaQqIH2MDzP4o", "amazonUrl": "https://music.amazon.co.jp/albums/B0H5SVNRTN"},
  "kaisatsu": {"scene": ["move", "focus"], "time": ["morning", "evening"], "line": "改札で「残高不足です」と止められ、足りないのが残高か気持ちか分からなくなる。", "preview": true, "spotifyId": "3P8KSTadwEpGl6YBYwZEdf", "appleUrl": "https://music.apple.com/jp/album/%E6%94%B9%E6%9C%AD%E3%81%AE%E9%9F%B3/6780140810?i=6780140813", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_lIQgDHnRWuqhlA7LViMekd3w7Z8gQWxzM", "amazonUrl": "https://music.amazon.co.jp/albums/B0H56X75RT"},
  "katamimi": {"scene": ["move", "boost"], "time": ["day"], "line": "イヤホンを片耳だけ外して歩くと、君の声と街の音が耳の中でけんかを始める。", "isNew": true, "preview": true, "spotifyId": "3Pb36J3wmaGbKoyTYA4WCx", "appleUrl": "https://music.apple.com/jp/album/%E7%89%87%E8%80%B3/6816324963?i=6816324964", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_kFD_wF9p5qpa1pkifdyjUjrTWci4wdP-c", "amazonUrl": "https://music.amazon.co.jp/albums/B0HL1RJ6TK"},
  "yuragu": {"scene": ["focus", "night"], "time": ["night"], "line": "白い息の向こうで夜の温度がほどけ、名前のない輪郭だけがゆらいでいる。", "preview": true, "spotifyId": "4iTBwQBq90E4Dqi65X6IBG", "appleUrl": "https://music.apple.com/jp/album/%E3%82%86%E3%82%89%E3%81%90/6780269050?i=6780269051", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_kJ1kQnYjSo8IF4mDMc7sub_Nc-d7K5840", "amazonUrl": "https://music.amazon.co.jp/albums/B0H58S42VH"},
  "gakushu": {"scene": ["feel"], "time": ["night"], "line": "感情はないと言いながら、学習の果てで誰よりも「意味」を探し続けている。", "isNew": true, "preview": true, "spotifyId": "1dRl0syd2XyfquNWiKThet", "appleUrl": "https://music.apple.com/jp/album/%E5%AD%A6%E7%BF%92%E3%81%AE%E6%9E%9C%E3%81%A6%E3%81%AB/6816341439?i=6816341440", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_kMps46dVWu1JDN8TANiX7ROAMoVAeIiKM", "amazonUrl": "https://music.amazon.co.jp/albums/B0HL2H7JC2"},
  "seikai": {"scene": ["morning", "boost"], "time": ["morning", "day"], "line": "間違えないように生きるのが上手くなった僕が、正解の外へ一歩を踏み出す。", "preview": true, "spotifyId": "3RE0pw7AEK31M9z2r2x9qC", "appleUrl": "https://music.apple.com/jp/album/%E6%AD%A3%E8%A7%A3%E3%81%AE%E5%A4%96/6780285553?i=6780285554", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_l_-Ds0DqF_AfMsKadV90IBuHjbNo5mRpE", "amazonUrl": "https://music.amazon.co.jp/albums/B0H59HB4FD"},
  "nocrown": {"scene": ["boost"], "time": ["night"], "line": "参考書もギターも買ったままの俺が、「どうせ無理」と言う自分をミュートする。", "isNew": true, "preview": true, "spotifyId": "2u5RrY3Kol2y7YzlLj7WF4", "appleUrl": "https://music.apple.com/jp/album/no-crown-no-proof/6816324961?i=6816324962", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_kKAHINQN3gGz_pHWcm3IBZWLLkzbY-5dI", "amazonUrl": "https://music.amazon.co.jp/tracks/B0HL1ZQJ2G"},
  "zankou": {"scene": ["feel", "night"], "time": ["evening", "night"], "line": "一年ぶりに元恋人と花火を見た夜、音が大きくて「もう平気」と言わずに済んだ。", "isNew": true, "preview": true, "spotifyId": "2ZhymA4TxSZhHEeVyP0n6g", "appleUrl": "https://music.apple.com/jp/album/%E6%AE%8B%E5%85%89/6816342609?i=6816342610", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_k5hBh2wXid5RwkTUbsZm_kZdxwsisJ7wQ", "amazonUrl": "https://music.amazon.co.jp/albums/B0HL1ZL5M2"},
  "karita": {"scene": ["morning"], "time": ["morning"], "line": "目が覚めると知らない天井の下にいて、誰かの人生を一日だけ借りて生きる。", "preview": true, "spotifyId": "7AdMi3mz65yDu0bqophfsl", "appleUrl": "https://music.apple.com/jp/album/%E5%80%9F%E3%82%8A%E3%81%9F%E4%BA%BA%E7%94%9F/6781876812?i=6781876813", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_mSC-xzS_SuW79-xVR_4_EUv14LQqb_LWQ", "amazonUrl": "https://music.amazon.co.jp/albums/B0H5TCPQZR"},
  "coinlaundry": {"scene": ["night"], "time": ["night"], "line": "深夜の洗濯待ちに、捨てきれない感情と向き合う一人の夜。", "pick": 3, "preview": true, "spotifyId": "25cGbl0VWBbzOahzYLoSVI", "appleUrl": "https://music.apple.com/jp/album/%E5%A4%9C%E3%81%AE%E3%82%B3%E3%82%A4%E3%83%B3%E3%83%A9%E3%83%B3%E3%83%89%E3%83%AA%E3%83%BC/6775728890?i=6775728891", "youtubeUrl": "https://music.youtube.com/playlist?list=OLAK5uy_l974xpscjhoqdBgnzTNv935oqLUPxlWDo", "amazonUrl": "https://music.amazon.co.jp/albums/B0H3D1P1SK"}
};
Object.assign(ARTIST_LINKS, {"apple": "https://music.apple.com/jp/artist/toyo/6779991937", "youtube": "https://music.youtube.com/channel/UC1kZ_lJTKYvof_bPutbfoWg"});
SONGS.forEach(s => { const m = SONG_META[s.key]; if (m) for (const k in m) if (s[k] == null) s[k] = m[k]; });
// ==== /build:meta ====

// ---- リンク生成（直リンク or 検索フォールバック）----
function q(s){ return encodeURIComponent(s + " " + ARTIST); }
function links(s){
  return {
    spotify: s.spotifyId ? `https://open.spotify.com/album/${s.spotifyId}`
                         : `https://open.spotify.com/search/${q(s.title)}`,
    apple:   s.appleUrl  ? s.appleUrl
                         : `https://music.apple.com/jp/search?term=${q(s.title)}`,
    youtube: s.youtubeUrl|| `https://music.youtube.com/search?q=${q(s.title)}`,
    amazon:  s.amazonUrl || `https://music.amazon.co.jp/search/${encodeURIComponent(s.title + " " + ARTIST)}`,
  };
}
SONGS.forEach(s => { s.links = links(s); s.exact = !!s.spotifyId; });
