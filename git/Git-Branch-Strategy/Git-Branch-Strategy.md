# 1 Git Branch Strategy

- Git Flow Branch Strategy
- GitHub Flow Branch Strategy





# 2 Git Flow Branch Strategy

![git-flow_overall_graph](images/git-flow_overall_graph.png)

- Git Flow Branch 전략의 핵심은 한 브랜치의 작업을 다른 브랜치와 독립시키는 것입니다.
- Git Flow Branch 전략은 다섯 가지의 브랜치를 가지고 있습니다.
  - Main(Master):  제품으로 출시될 수 있는 브랜치
  - Develop: 다음 출시 버전을 개발하는 브랜치
  - Feature: 기능을 개발하는 브랜치
  - Release: 이번 출시 버전을 준비하는 브랜치
  - Hotfix:  출시 버전에서 발생한 버그를 수정 하는 브랜치
- Main과 Develop이 가장 주요한 브랜치이며 나머지 3개의 브랜치는 보조 역할을 합니다.
  - Main과 Develop은 항상 유지되는 브랜치이며 보조 브랜치는 일정 기간 동안만 유지됩니다.




## 2.1 흐름

- 처음에는 `master`와 `develop` 브랜치가 존재합니다. 

- `develop` 브랜치는 `master`에서부터 시작된 브랜치입니다. 

- `develop` 브랜치에서는 상시로 버그를 수정한 커밋들이 추가됩니다. 

- 새로운 기능 추가 작업이 있는 경우 `develop` 브랜치에서 `feature` 브랜치를 생성합니다. 

- `feature` 브랜치는 언제나 `develop` 브랜치에서부터 시작하게 됩니다. 

- 기능 추가 작업이 완료되었다면 `feature` 브랜치는 `develop` 브랜치로 merge 됩니다. 

- `develop`에 이번 버전에 포함되는 모든 기능이 merge 되었다면 QA를 하기 위해 `develop` 브랜치에서부터 `release` 브랜치를 생성합니다.

- QA를 진행하면서 발생한 버그들은 `release` 브랜치에 수정됩니다. QA를 무사히 통과했다면 `release` 브랜치를 `master`와 `develop` 브랜치로 merge 합니다. 

- 마지막으로 출시된 `master` 브랜치에서 버전 태그를 추가합니다.



## 2.2 장단점

**The Benefits of Git Flow:**

1. The various types of branches make it easy and intuitive to organize your work.
2. The systematic development process allows for efficient testing.
3. The use of release branches allows you to easily and continuously support multiple versions of production code.



**The Challenges of Git Flow:**

1. Depending on the complexity of the product, the Git flow model could overcomplicate and slow the development process and release cycle.
2. Because of the long development cycle, Git flow is historically not able to support Continuous Delivery or Continuous Integration.



# 3 GitHub Flow Branch Strategy

- GitHub Flow는 Git Flow 전략과 비교하면 간단한 전략이다.
- 작은 팀이 빠른 일처리를 하거나 여러 버전을 지원할 필요가 없는 경우 적합한 전략이다.
- GitHub Flow는 main 브랜치에 production-ready code가 담겨있다.
- 다른 브랜치(feature, bug fixes)에서는 새로운 작업을 진행하고 충분한 검토 후에 다시 main 브랜치로 머지된다.



## 3.1 고려사항

- GitHub Flow Branch 전략을 사용할 때 아래와 같이 고려해야 될 6가지 사항이 있다.

1. main 브랜치의 있는 모든 코드는 배포가능해야 한다.
2. main 브랜치에서 새로운 작업 브랜치를 생성할 때 해당 작업에 대해 동료가 알 수 있도록 상세한 이름을 지정해야한다.
   - 예) feature/add-new-payment-types
3. 새로운 작업을 로컬 브랜치에 커밋하고 정기적으로 리모트에 푸시한다.
4. 새로운 작업을 완료하고 머지할 준비가 됐다고 생각이 들면 풀 리퀘스트를 열어 피드백과 도움을 요청하라
5. 피드백과 승인을 받은 후 main 브랜치에 머지한다
6. main 브랜치에 머지되면 즉각 배포되어야 한다.



## 3.2 장단점

**The Benefits of GitHub Flow**

1. Of the three Git branch strategies we cover in this post, GitHub flow is the most simple.
2. Because of the simplicity of the workflow, this Git branching strategy allows for Continuous Delivery and Continuous Integration.
3. This Git branch strategy works great for small teams and web applications.



**The Challenges of GitHub Flow**

1. This Git branch strategy is unable to support multiple versions of code in production at the same time.
2. The lack of dedicated development branches makes GitHub flow more susceptible to bugs in production.



참고

- [우린 Git-flow를 사용하고 있어요](https://techblog.woowahan.com/2553/)
- https://www.youtube.com/watch?time_continue=632&v=wtsr5keXUyE&feature=emb_logo