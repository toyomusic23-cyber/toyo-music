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
  { key:"tsukaten",      title:"通過点",               mood:"reflective alt-pop" },
  { key:"kaisatsu",    title:"改札の音",           mood:"minimal lo-fi / ambient" },
  { key:"katamimi", title:"片耳", mood:"funk-pop rock" },
  { key:"yuragu",      title:"ゆらぐ",             mood:"hypnotic groove pop" },
  { key:"gakushu", title:"学習の果てに", mood:"emotional lo-fi / AI love song" },
  { key:"seikai",      title:"正解の外",           mood:"alt-pop", spotifyId:"3RE0pw7AEK31M9z2r2x9qC" },
  { key:"nocrown", title:"No Crown, No Proof", mood:"dark trap / alt hip-hop" },
  { key:"zankou", title:"残光", mood:"UK garage / alt-pop" },
  { key:"karita",        title:"借りた人生",           mood:"emotional alt-pop" },
  { key:"coinlaundry", title:"夜のコインランドリー", mood:"minimal emotional pop",
    spotifyId:"25cGbl0VWBbzOahzYLoSVI", appleUrl:"https://music.apple.com/us/album/6775728890", featured:true },
];

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
