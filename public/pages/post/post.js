import { getPost } from "../../fetch/postApi.js";
import { AvatarComponent } from "../../semantics/header/avatar.js";

const createPostTemplate = (dto) => {
  const hasImage = !!dto.postImagePath;

  const imageSection = hasImage
    ? `<figure class="post-image">
        <img src="${dto.postImagePath}" alt="게시글 이미지" class="post-image-content" />
      </figure>`
    : "";

  return `<h1 class="post-title">${dto.title}</h1>

        <div class="post-meta">
          <div class="author">
            <span class="avatar"></span>
            <div class="who" id="user_${dto.authorId}">
              <strong class="name">${dto.nickname}</strong>
              <time class="time">${new Date(
                dto.createdAt
              ).toLocaleDateString()}</time>
            </div>
          </div>
          <div class="post-actions ${dto.owner ? "" : "hide"}">
            <a class="btn ghost" href="/post-form?postId=${
              dto.postId
            }" id="btnEdit"
              >수정</a
            >
            <button class="btn danger" id="btnDelete">삭제</button>
          </div>
        </div>

        ${imageSection}
            <p><br/></p>
            <p><br/></p>

        <div class="post-body">${dto.content}</div>

        <ul class="post-stats">
          <li class="stat">
            <span class="num">${
              dto.likeCount
            }</span><span class="label">좋아요수</span>
          </li>
          <li class="stat">
            <span class="num">${
              dto.viewCount
            }</span><span class="label">조회수</span>
          </li>
          <li class="stat">
            <span class="num">${
              dto.commentCount
            }</span><span class="label">댓글</span>
          </li>
        </ul>`;
};

document.addEventListener("DOMContentLoaded", async () => {
  const parsedPath = window.location.pathname.split("/");
  const dto = await getPost(parsedPath[2]);

  const postNode = document.querySelector(".post");

  postNode.innerHTML = createPostTemplate(dto.data);
  postNode.classList.toggle("has-image", dto.postImagePath);
  postNode.classList.toggle("no-image", !dto.postImagePath);
  // 게시글 작성자의 아바타 컴포넌트 초기화
  const avatarSelector = ".post .avatar";
  const avatarComp = new AvatarComponent(avatarSelector, {
    useDropdown: false,
    onAvatarClick: () => {
      window.location.href = `/users/${dto.data.authorId}`;
    },
  });
  avatarComp.init();
  avatarComp.loadPostAvatar(dto.data.authorThumbnailPath);
});
