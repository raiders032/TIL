## DispatcherServlet

> Spring MVC는 다른 웹 프레임워크와 마찬가지로 front controller pattern으로 디자인 되었다. 여기서  front controller란 `DispatcherServlet` 를 의미한다. `DispatcherServlet`은 모든 Controller 앞에 위치하여 요청에 대한 공통된 로직을 처리를 할 수 있다. `DispatcherServlet`은 설정 가능한 여러 요소들에게 일을 위임시키는 방식으로 동작한다. 이러한 방식은 유연성을 제공해 다양한 작업 방식을 지원한다.
>
> `DispatcherServlet` 은 다른 `Servlet` 과 마찬가지로 Servlet specification에 따라 선언되고 매핑되어야 하는데 이때 specification으로 Java configuration 또는 `web.xml` 을 사용할 수 있다.
>
> 아래는 Java configuration으로 `DispatcherServlet` 을 선언하고 등록하는 코드이다.
>
> ```java
> public class MyWebApplicationInitializer implements WebApplicationInitializer {
> 
>     @Override
>     public void onStartup(ServletContext servletCxt) {
> 
>         // Load Spring web application configuration
>         AnnotationConfigWebApplicationContext ac = new AnnotationConfigWebApplicationContext();
>         ac.register(AppConfig.class);
>         ac.refresh();
> 
>         // Create and register the DispatcherServlet
>         DispatcherServlet servlet = new DispatcherServlet(ac);
>         ServletRegistration.Dynamic registration = servletCxt.addServlet("app", servlet);
>         registration.setLoadOnStartup(1);
>         registration.addMapping("/app/*");
>     }
> }
> ```
>
> 아래는 `web.xml`으로 `DispatcherServlet` 을 선언하고 등록하는 코드이다.
>
> ```xml
> <web-app>
> 
>     <listener>
>         <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
>     </listener>
> 
>     <context-param>
>         <param-name>contextConfigLocation</param-name>
>         <param-value>/WEB-INF/app-context.xml</param-value>
>     </context-param>
> 
>     <servlet>
>         <servlet-name>app</servlet-name>
>         <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
>         <init-param>
>             <param-name>contextConfigLocation</param-name>
>             <param-value></param-value>
>         </init-param>
>         <load-on-startup>1</load-on-startup>
>     </servlet>
> 
>     <servlet-mapping>
>         <servlet-name>app</servlet-name>
>         <url-pattern>/app/*</url-pattern>
>     </servlet-mapping>
> 
> </web-app>
> ```