## JSP

> JSP(JavaServer Pages)는 HTML내에 자바 코드를 삽입하여 웹 서버에서 동적으로 웹 페이지를 생성하여 웹 브라우저에 돌려주는 서버 사이드 스크립트 언어이다. Java EE 스펙 중 일부로 웹 애플리케이션 서버에서 동작한다.
>
> 자바 서버 페이지는 실행시에는 자바 서블릿으로 변환된 후 실행되므로 서블릿과 거의 유사하다고 볼 수 있다. 하지만, 서블릿과는 달리 HTML 표준에 따라 작성되므로 웹 디자인하기에 편리하다. 1999년 썬 마이크로시스템즈에 의해 배포되었으며 이와 비슷한 구조로 PHP, ASP, ASP.NET 등이 있다.
>
> 아파치 스트럿츠나 자카르타 프로젝트의 JSTL 등의 JSP 태그 라이브러리를 사용하는 경우에는 자바 코딩없이 태그만으로 간략히 기술이 가능하므로 생산성을 높일 수 있다.



## 동작 구조

* 클라이언트에서 서비스가 요청되면, JSP의 실행을 요구하고, JSP는 [웹 애플리케이션 서버](https://ko.wikipedia.org/wiki/웹_애플리케이션_서버)의 서블릿 컨테이너에서 서블릿 원시코드로 변환된다.
* 그 후에 서블릿 원시코드는 바로 컴파일된 후 실행되어 결과를 HTML 형태로 클라이언트에 돌려준다.



## 예시

* 서블릿으로 변환되기 때문에 예약어 `request`, `response`, `out` 등을 쓸 수 있다.

```jsp
// 회원 저장 JSP
<%@ page import="hello.servlet.domain.member.MemberRepository" %>
<%@ page import="hello.servlet.domain.member.Member" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %> 
<%
    // request, response 사용 가능
    MemberRepository memberRepository = MemberRepository.getInstance();
    System.out.println("save.jsp");
    String username = request.getParameter("username");
    int age = Integer.parseInt(request.getParameter("age"));
    Member member = new Member(username, age); System.out.println("member = " + member); memberRepository.save(member);
%>
<html>
  <head>
		<meta charset="UTF-8"> 
  </head>
	<body> 
    성공
    <ul>
      <li>id=<%=member.getId()%></li> 
      <li>username=<%=member.getUsername()%></li> 
      <li>age=<%=member.getAge()%></li>
    </ul>
    <a href="/index.html">메인</a>
	</body>
</html>
```

```jsp

<%@ page import="java.util.List" %>
<%@ page import="hello.servlet.domain.member.MemberRepository" %>
<%@ page import="hello.servlet.domain.member.Member" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %> 
<%
  MemberRepository memberRepository = MemberRepository.getInstance();
  List<Member> members = memberRepository.findAll(); 
%>
<html>
  <head>
		<meta charset="UTF-8">
    <title>Title</title>
  </head>
     <body>
       <a href="/index.html">메인</a>
       <table>
           <thead>
               <th>id</th>
               <th>username</th>
               <th>age</th>
           </thead>
           <tbody> 
              <%
                for (Member member : members) {
                out.write("<tr>");
                out.write("<td>" + member.getId() + "</td>");
                out.write("<td>" + member.getUsername() + "</td>");
                out.write("<td>" + member.getAge() + "</td>");
                out.write("</tr>");
              %>
            </tbody>
 				</table>
  		</body>	
</html>
```



## 서블릿과 JSP의 한계

* 서블릿만 이용해서 개발할 때는 뷰(View)화면을 위한 HTML을 만드는 작업이 자바 코드에 섞여서 지저분하고 복잡했다. 
* JSP를 사용한 덕분에 뷰를 생성하는 HTML 작업을 보다 쉬워지고 동적으로 변경이 필요한 부분에만 자바 코드를 적용했다. 
* 여전한 문제점
  * 회원 저장 JSP를 보자. 코드의 상위 절반은 회원을 저장하기 위한 비즈니스 로직이고, 나머지 하위 절반만 결과를 HTML로 보여주기 위한 뷰 영역이다.
  * 코드를 잘 보면, JAVA 코드, 데이터를 조회하는 리포지토리 등등 다양한 코드가 모두 JSP에 노출되어 있다. 
  * JSP가 너무 많은 역할을 한다. 



## MVC 패턴의 등장

비즈니스 로직은 서블릿 처럼 다른곳에서 처리하고, JSP는 목적에 맞게 HTML로 화면(View)을 그리는 일에 집중하도록 하자. 

