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
  instagram: "" // ← ToyoのInstagram URLを入れる
};

// 新しい順（mymusic順）。cover はファイル名キー。featured=ヒーロー強調。
const SONGS = [
  { key:"honto",       title:"本当に選んでるなら", mood:"alt groove / dance rock", spotifyId:"7kSQoUJOuaWTBNyxkhCVyf" },
  { key:"reframing",   title:"リフレーミング",     mood:"emotional pop" },
  { key:"kansokusha",  title:"僕らは観測者",       mood:"cinematic alt-pop" },
  { key:"seikai",      title:"正解の外",           mood:"alt-pop", spotifyId:"3RE0pw7AEK31M9z2r2x9qC" },
  { key:"hakushu",     title:"拍手",               mood:"emotional pop" },
  { key:"negai",       title:"願い",               mood:"emotional pop", spotifyId:"4KiOKJZG9RbwSY0TwPZK3A" },
  { key:"samenight",   title:"Same Night",         mood:"late-night pop" },
  { key:"lostfound",   title:"Lost & Found",       mood:"alt-pop" },
  { key:"signallost",  title:"Signal Lost",        mood:"electronic alt" },
  { key:"ochikobore",  title:"落ちこぼれの証明",   mood:"alt-pop", spotifyId:"3pLlqZNo3RE8dw05GqQatX" },
  { key:"origami",     title:"折り紙",             mood:"emotional pop" },
  { key:"bluepride",   title:"BLUE PRIDE",         mood:"dark trap / stadium anthem" },
  { key:"makimodoshi", title:"巻き戻し",           mood:"alt-pop" },
  { key:"yuragu",      title:"ゆらぐ",             mood:"hypnotic groove pop" },
  { key:"atokara",     title:"あとから",           mood:"groove pop / dance rock" },
  { key:"konbini",     title:"深夜のコンビニ",     mood:"lo-fi city pop", spotifyId:"4u0uksIfve6Z8t5RN132U2" },
  { key:"kaisatsu",    title:"改札の音",           mood:"minimal lo-fi / ambient" },
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
