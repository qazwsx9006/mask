function insertImages() {
  const imageLists = [
    "https://i.imgur.com/jQsJk5C.jpg",
    "https://i.imgur.com/xaMWo8F.png",
    "https://i.imgur.com/7ZSglpc.jpg",
    "https://i.imgur.com/EckthZB.png",
    "https://i.imgur.com/cP2ru0G.jpg",
    "https://i.imgur.com/QNl3Yh7.jpg",
    "https://i.imgur.com/LMdfruc.jpg",
    "https://i.imgur.com/ob4nIJU.jpg",
  ];

  for (let imageUrl of imageLists) {
    const li = generateImageLi(imageUrl);
    $(".msgWindow").append(li);
  }
}

function generateImageLi(imageUrl) {
  return `<li>
            <div class="avatar">
              幫手
            </div>
            <div class="msgBubble">
              <div class="bubble">
                <img src="${imageUrl}" alt="">
              </div>
            </div>
          </li>`;
}

function newsListBindEvent() {
  const latestNewsId = "1585582107822";
  const latestSeenNews = localStorage.getItem("qazwsx9006Mask");
  if (!latestSeenNews || latestSeenNews != latestNewsId)
    $("#newsList .tipLight").removeClass("close");

  $("#newsList").on("click", function () {
    $("#news").show();
    localStorage.setItem("qazwsx9006Mask", latestNewsId);
    $("#newsList .tipLight").addClass("close");
  });
}

function bootstrap() {
  insertImages();
  newsListBindEvent();
}

module.exports = bootstrap();
