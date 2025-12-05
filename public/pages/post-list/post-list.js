import { getPostlist } from "../../fetch/postListApi.js";
import { AvatarComponent } from "../../semantics/header/avatar.js";

const endNode = document.getElementById("sentinel");
const pNode = document.getElementById("postList");

// a 태그로 화면전환 or click 이벤트 넣기
const createTemplate = ({
  postId,
  title,
  createdAt,
  likeCount,
  commentCount,
  clickCount,
  userId,
  authNickname,
}) => {
  return `
    <article class="post-card" id="post_${postId}">
      <div class="card-head">
        <h3 class="title">${title}</h3>
        <time class="time">${createdAt}</time>
      </div>

      <div class="meta">
        <span>좋아요 ${likeCount}</span>
        <span>댓글 ${commentCount}</span>
        <span>조회수 ${clickCount}</span>
      </div>

      <div class="card-foot">
        <span class="avatar"></span>
        <span class="author" id="user_${userId}">${authNickname}</span>
      </div>
    </article>
  `;
};

function checkNullAndUndefind(json) {
  return Object.entries(json).filter((e) => {
    const v = e[1];
    if (v === undefined || v === null) return false;
    try {
      parseInt(v);
    } catch (e) {
      return false;
    }
    return true;
  });
}

function arrayToJson(array) {
  const rtn = {};
  array.forEach((e) => {
    rtn[e[0]] = e[1];
  });
  return rtn;
}

function removeInvalidJson(json) {
  return arrayToJson(checkNullAndUndefind(json));
}

let lastReadId = null;
let limit = 3;
let hasNext = true;
let observer = new IntersectionObserver(observeLoadFetch);
observer.observe(endNode);
let isLoading = false;

async function loadAndFetch() {
  if (!hasNext) return;
  const paramValues = { lastReadId, limit };

  const params = new URLSearchParams(removeInvalidJson(paramValues));
  const dto = await getPostlist(`/posts?${params}`);

  function calcTimeInCurrentTz(time) {
    return new Date(time).toLocaleString();
  }

  dto.posts.forEach((ele) => {
    const user = ele.authorThumbNailDto;

    const template = createTemplate({
      postId: ele.postId,
      title: ele.title,
      likeCount: ele.postLike,
      commentCount: ele.commentCount,
      clickCount: ele.clickCount,
      userId: user.userId,
      authNickname: user.authorNickname,
      createdAt: calcTimeInCurrentTz(ele.createdAt),
      thumbNailPath: ele.thumbNailPath,
    });

    pNode.insertAdjacentHTML("beforeend", template);

    // 방금 추가된 카드 가져오기
    const postCard = document.getElementById(`post_${ele.postId}`);

    postCard.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = `/post/${ele.postId}`;
    });

    const selector = `#post_${ele.postId} .avatar`;
    const avatarComp = new AvatarComponent(selector, {
      useDropdown: false,
      onAvatarClick: () => {
        window.location.href = `/users/${user.userId}`;
      },
    });
    console.log(ele);
    avatarComp.init();

    // 백엔드에서 제공하는 thumbnailPath 사용
    const thumbnailPath = ele.authorThumbNailDto.thumbnailPath;
    avatarComp.loadPostAvatar(thumbnailPath);
  });

  hasNext = dto.hasNext;
  if (hasNext) {
    lastReadId = dto.lastPostId || null;
  }
}

// 지금은 더 불러올 것이 없다면, 더이상 불러올 수 없는 상황이 됨.
// 추후 폴링이나, http 이외의 프로토콜을 쓴다면 상태 갱신으로 가능할듯.
async function observeLoadFetch(entries) {
  if (!entries[0].isIntersecting || isLoading) return;
  isLoading = true;
  await loadAndFetch();
  isLoading = false;
}
