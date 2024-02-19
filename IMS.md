# IMS

## IMS의 역할

- 프로덕트의 이슈을 발견하고 이슈를 처리하는 이슈 트랙킹 시스템이다.
- IMS의 사용자
	- QA: 프로덕트의 이슈를 발견하고 이슈를 등록한다.
	- 이슈 핸들러(연구원): 이슈를 할당 받고 처리한다.

<br>

## SR과의 관계

- IMS는 QA와 이슈 핸들러와의 이슈 트래킹 시스템이고 SR은 프로덕트 사용자와 QA 사이의 이슈 트래킹 시스템이다.
- 프로덕트 사용자가 프로덕트를 사용하면서 발생하는 이슈를 SR에 등록하고 QA가 해당 이슈를 처리한다.
- QA가 직접 처리할 수 없는 이슈에 대해서는 IMS에 이슈를 등록해 이슈 처리를 이슈 핸들러(연구원)에게 위임한다.
	- SR에서 처리하지 못하는 이슈를 IMS로 올릴 경우 이슈 핸들러(연구원)가 이슈 처리에 대한 컨텍스트(SR에서 진행된 이슈 처리 상황)를 알 수 있도록 IMS에 이슈 등록 시 SR 이슈에대한 참조를 건다.

<br>

# 시나리오

## Issue 처리 과정

**이슈  등록 과정**

1. QA가 프로덕트를 테스트하고 결함을 발견한다. (또는 SR에서 해결하지 못한 이슈가 있다면)
2. IMS에 이슈를 등록한다.(SR에서 올라온 이슈라면 SR 이슈를 참조한다.)

**이슈 핸들러 배정**

1. 이슈가 등록되면 이슈 핸들러 후보들에게 알림이 간다.(알림 기능 어려우니 생략)
2. 이슈는 키워드를 가지고 있다. 해당 키워드의 담당자가 해당 이슈의 핸들러를 자신으로 지정한다.(키워드 뽑는 것도 어려우니 생략)
3. 이슈 관리자가 적합한 이슈 핸들러에게 이슈를 배정한다.

**이슈 처리 과정**

1. 이슈를 처리하면서 소통은 코멘트로 한다.
2. 이슈가 해결되면 이슈 상태를 변경한다.

<br>

# ISSUE


## 이슈 핸들러를 어떻게 지정할 것인가? 

- QA가 이슈를 등록할 때 해당 이슈를 처리할 이슈 핸들러를 직접 정하는 것이 좋은가?
	- QA는 어떤 연구원이 어떤 문제를 담당하는지 잘 모른다.
- 이슈가 등록되면 예비 이슈 핸들러들이 자신이 처리할 수 있는 이슈를 자신에게 배정하기
	- 아무도 배정 안한다.
- 이슈 관리자(연구원)가 이슈를 적합한 이슈 핸들러에게 할당하기
	- 이게 현실적이다.  

<br>

## SR에서 올라온 이슈를 처리했을 때 SR에 어떻게 응답을 할 것인가?

- 프로덕트 사용자와 QA가 소통하고 프로덕트 사용자와 이슈 핸들러 사이의 직접적으로 소통하지 않게 IMS에서 처리된 이슈를 바탕으로 QA가 SR이슈에 응답한다.

# API

## Create

### 이슈 등록

**input**

- input
	- registrantId: number
	- categoryId: number
	- title: string
	- description: string
	- productId: number 
	- priority: string( "NORMAL" | "HIGH" | "VERY_HIGH")
	- handlerId: number
	- customer: string
	- srIssueId: number (optional)
	- relatedIssueId: number (optional)
	- attachments: array (optional)
		- ?
- output
	- void

<br>

### 코멘트 등록

- input
	- issueId: number
	- registrantId: number
	- description: string
	- attachments: array (optional)
		- ?
- output
	- void
<br>

## Read

### 이슈 단건 조회

- input
	- issueId: number
- output
	- issueId: number
	- registrant: string
	- category: string
	- title: string
	- description: string
	- product: string
	- productVersion: string 
	- priority: string
	- status: string
	- handler: string 
	- relatedSrId: number
	- customer: string
	- relatedIssueIds: `array<number>` 
	- attachments: `array<object>`
	- registeredDate: string
	- closedDate: string


### 이슈 다건 조회

- input
	- registrant(optional)
	- handler id(optional)
	- category(optional)
	- product(optional)
		- product version(optional)
	- priority(optional)
	- status(optional)
	- date

<br>

## Update

### 이슈 핸들러 변경

- input
	- issue id
	- handler id

### 이슈 상태 변경

- input
	- issue id

<br>

## Delete

### 이슈 삭제

- 없음

### 코멘트 삭제

- 

<br>

# ERD

- [ERD 링크](https://app.diagrams.net/#G1cj-ZDf1jcSTr5szNmfPM6UZxQDlDZ8BU#%7B%22pageId%22%3A%223O8uHk_I1FFlTeGtJ923%22%7D)

## issue

- 

## category
- 카테고리의 종류
	- Technical Support
	- Defect