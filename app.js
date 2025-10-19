var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var app = express();
var PORT = process.env.PORT || 3000;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 정적 파일 루트
app.use(express.static(path.join(__dirname, "public")));

// 정적파일 사전 검증 로직 필요
const PAGES = [
  "/login",
  "/signin",
  "/post",
  "/post-create",
  "/post-list",
  "/404",
];

app.use(PAGES, (req, res) => {
  const name = req.baseUrl.slice(1); // "/login" -> "login"
  const file = path.join(__dirname, "public", "pages", name, `${name}.html`);
  res.sendFile(file, (err) => {
    if (err) {
      res
        .status(404)
        .sendFile(path.join(__dirname, "public", "pages", "404", "404.html"));
    }
  });
});

// catch 404, PAGES로 관리되지 않는 경로 탐색 시 404
app.use((req, res) => {
  res
    .status(404)
    .sendFile(path.join(__dirname, "public", "pages", "404", "404.html"));
});

// 에러 핸들러: 텍스트/JSON로 처리
app.use((err, req, res, next) => {
  console.error(req.url);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server Error" });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
}

module.exports = app;
