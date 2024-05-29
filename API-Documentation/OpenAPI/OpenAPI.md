# 1 OpenAPI

- OpenAPI는 RESTful API를 설명하고 문서화하기 위한 사양(Specification)입니다.
- 이전에는 Swagger 사양으로 알려져 있었지만, 현재는 Linux Foundation의 오픈소스 프로젝트인 OpenAPI Initiative(OAI)에서 관리되고 있습니다
- OpenAPI 사양은 YAML 또는 JSON 형식을 사용하여 API의 엔드포인트, 요청/응답 형식, 인증 방법 등을 기술합니다.

<br>

# 2 OpenAPI의 목적

1. API 설명
    - OpenAPI 문서는 API의 엔드포인트, HTTP 메서드, 입력 매개변수, 응답 형식 등을 자세히 설명합니다.
    - 이를 통해 API의 기능과 사용 방법을 명확하게 전달할 수 있습니다.
2. 일관성 유지
    - OpenAPI 사양은 API 설계와 문서화에 대한 표준을 제공합니다.
    - 일관된 구조와 형식을 사용하여 API를 기술함으로써, API 개발 팀 간의 소통과 협업을 촉진할 수 있습니다.
3. 도구 통합
    - OpenAPI 문서는 다양한 도구와 프레임워크에서 활용될 수 있습니다.
    - API 클라이언트 코드 생성, 모의 서버 생성, 테스트 자동화 등 다양한 개발 작업을 자동화하는 데 사용될 수 있습니다.
4. 대화형 문서
    - OpenAPI 문서는 Swagger UI와 같은 도구를 통해 대화형 API 문서로 렌더링될 수 있습니다.
    - 개발자들은 웹 브라우저에서 API를 탐색하고, 요청을 보내고, 응답을 확인할 수 있습니다.

<br>

# 3 예시

```yaml
openapi: 3.0.0
info:
  title: Sample API
  description: API description in Markdown.
  version: 1.0.0

servers:
  - url: https://api.example.com/v1
    description: Production server

paths:
  /users:
    get:
      summary: List all users
      description: Returns a list of all users in the system.
      responses:
        '200':
          description: A list of users.
          content:
            application/json:    
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
    post:
      summary: Create a new user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/NewUser'
      responses:
        '201':
          description: Created
          content:
            application/json:    
              schema:
                $ref: '#/components/schemas/User'

  /users/{userId}:
    get:
      summary: Get a user by ID
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: The requested user.
          content:
            application/json:    
              schema:
                $ref: '#/components/schemas/User'

components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
        email:
          type: string
    NewUser:
      type: object
      properties:
        name:
          type: string
        email:
          type: string
```
