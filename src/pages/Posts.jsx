import React, { useState, useEffect, useRef } from 'react';
import PostService from '../API/PostService';
import PostFilter from '../components/PostFilter';
import PostForm from '../components/PostForm';
import MyButton from '../components/UI/button/MyButton';
import Loader from '../components/UI/loader/loader';
import MyModal from '../components/UI/modal/MyModal';
import Pagination from '../components/UI/pagination/Pagination';
import { useFetching } from '../hooks/useFetching';
import { usePosts } from '../hooks/usePosts';
import { getPagesCount } from '../utils/pages';
import PostList from '../components/PostList';
import '../styles/App.css';
import { useObserver } from '../hooks/useObserver';
import MySelect from '../components/UI/select/MySelect';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState({ sort: '', query: '' });
  const [modal, setModal] = useState(false);
  const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  // для бесконечной ленты
  const lastElement = useRef();

  const [fetchPosts, isPostsLoading, postError] = useFetching(
    async (limit, page) => {
      const response = await PostService.getAll(limit, page);
      // для бесконечной ленты
      setPosts([...posts], ...response.data);
      // setPosts для постраничного вывода
      setPosts(response.data);
      const totalCount = response.headers['x-total-count'];
      setTotalPages(getPagesCount(totalCount, limit));
    }
  );

  // Реализация для постраничного вывода
  // useEffect - позволяет следить за стадиями ЖЦ компонента
  // получение данных при загрузке
  // useEffect(() => {
  //   fetchPosts(limit, page);
  // }, []);

  //для бесконечной ленты
  useObserver(lastElement, page < totalPages, isPostsLoading, () => {
    setPage(page + 1);
  });

  useEffect(() => {
    fetchPosts(limit, page);
  }, [page, limit]);

  const createPost = (newPost) => {
    setPosts([...posts, newPost]);
    setModal(false);
  };
  //хук useRef() - помогает получить доступ к DOM элементу

  //Получаем пост из дочернего компонента
  const removePost = (post) => {
    setPosts(posts.filter((p) => p.id !== post.id));
  };

  //для постраничного вывода
  // const changePage = (page) => {
  //   setPage(page);
  //   fetchPosts(limit, page);
  // };

  // для бесконечной ленты
  const changePage = (page) => {
    setPage(page);
  };
  return (
    <div className="App">
      <MyButton
        style={{ marginTop: '30px' }}
        onClick={() => {
          setModal(true);
        }}
      >
        Создать пост
      </MyButton>
      <MyModal visible={modal} setVisible={setModal}>
        <PostForm create={createPost} />
      </MyModal>
      <hr style={{ margin: '15px 0' }}></hr>
      <PostFilter filter={filter} setFilter={setFilter} />
      <MySelect
        value={limit}
        onChange={(value) => setLimit(value)}
        defaultValue="Количество элементов на странице"
        options={[
          { value: 5, name: '5' },
          { value: 10, name: '10' },
          { value: 25, name: '25' },
          { value: -1, name: 'все' },
        ]}
      />
      {postError && <h1>Ошибка: {postError}</h1>}
      {/* Отрисовка по условию */}
      {/* {sortedAndSearchedPosts.length ? (
        <PostList
          posts={sortedAndSearchedPosts}
          remove={removePost}
          title="Посты про JS"
        />
      ) : (
        <h1 style={{ textAlign: 'center' }}> Посты не найдены! </h1>
      )} */}
      {/* Бесконечная лента */}
      <PostList
        posts={sortedAndSearchedPosts}
        remove={removePost}
        title="Посты про JS"
      />
      <div ref={lastElement} style={{ height: 20 }} />
      {isPostsLoading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '50px',
          }}
        >
          <Loader />
        </div>
      )}
      <Pagination page={page} changePage={changePage} totalPages={totalPages} />
      {/* Постраничный вывод */}
      {/* {isPostsLoading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '50px',
          }}
        >
          <Loader />
        </div>
      ) : (
        <PostList
          posts={sortedAndSearchedPosts}
          remove={removePost}
          title="Посты про JS"
        />
      )}
      <Pagination page={page} changePage={changePage} totalPages={totalPages} /> */}
    </div>
  );
}

export default Posts;
