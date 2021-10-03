### 프로젝트 생성

```bash
# vue-todo 프로젝트 생성
vue create vue-todo
cd vue-todo
npm run serve
```



#### 참고

* [파비콘 생성 사이트](https://www.favicon-generator.org/)
* [아이콘 참조 사이트](https://fontawesome.com/v5.15/icons?d=gallery&p=2)



#### 컴포넌트 등록하기

```vue
<script>
import Modal from "./common/Modal.vue";

export default {
  components: {
    Modal: Modal,
  },
};
</script>
```



## [List Transitions](https://vuejs.org/v2/guide/transitions.html#List-Transitions)

