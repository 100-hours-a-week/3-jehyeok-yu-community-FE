import { getPost } from "../../fetch/postApi.js";

const createPostTemplate = (dto) => `<h1 class="post-title">${dto.title}</h1>

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

        <figure class="post-image"><!-- 이미지 자리 --></figure>

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

document.addEventListener("DOMContentLoaded", async () => {
  const parsedPath = window.location.pathname.split("/");
  const dto = await getPost(parsedPath[2]);

  const postNode = document.querySelector(".post");

  postNode.innerHTML = createPostTemplate(dto.data);
});
