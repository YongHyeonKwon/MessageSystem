package com.smhrd.controller;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.oreilly.servlet.MultipartRequest;
import com.oreilly.servlet.multipart.DefaultFileRenamePolicy;
import com.smhrd.model.Board;
import com.smhrd.model.BoardDAO;
import com.smhrd.model.WebMember;
import com.smhrd.model.WebMemberDAO;

// *.do -> 어떤 페이지가 요청을 하더라도 요청시 .do가 달려있다면 
// frontcontroller에서 모든 요청을 받을 수 있다.
@WebServlet("*.do")
public class FrontController extends HttpServlet {
   private static final long serialVersionUID = 1L;


   protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
      // FrontController 역할!
      // : 클라이언트가 어떤 요청을 하더라도 가장 먼저 요청을 받는 서블릿
      
      // 1. 클라이언트 요청 받아오기
      // http://localhost:8090/MessageSystem/goMain.do
      
      request.setCharacterEncoding("utf-8");
      String uri = request.getRequestURI();
      System.out.println("요청된 uri : " + uri);
      
      
      // 2. 어떤 요청이 들어왔는지 판단 하기!
      String contextpath = request.getContextPath();
      System.out.println("프로젝트명 : " + contextpath);
      
      // 요청된 서블릿의 이름만 가져오기!
      String result = uri.substring(contextpath.length());
      System.out.println("요청 이름 : "+result);
      
      // 3. 실제 해당하는 기능이 수행되도록 연결하기!
      
      String moveurl = "";
      if(result.equals("/goMain.do")) {
         // 메인으로 이동할 수 있는 기능 작성!
         moveurl = "WEB-INF/Main.jsp";
      } else if(result.equals("/goBoard.do")) {
         moveurl= "WEB-INF/BoardMain.jsp";
      } else if(result.equals("/goWrite.do")) {
         moveurl = "WEB-INF/BoardWrite.jsp";
      } else if(result.equals("/BoardService.do")) {

         // 프로젝트 내 폴더 생성
         // getServletcontext() : 실행되는 서블릿에 대한 정보를 가져올 수 있는 메소드
         String path = request.getServletContext().getRealPath("file");
         
         // 저장하고자 하느 파일의 최대 크기 지정! -> 1mb
         int maxSize = 1024 * 1024 * 5; // 5mb
         
         String encoding = "UTF-8";
         
         // 파일 업로드 하기 위하여 필요한 request 객체
         MultipartRequest multi = new MultipartRequest(
               request,
               path,
               maxSize,
               encoding,
               new DefaultFileRenamePolicy()
               );
         
         // new DefaultFileRenamePolicy()
         // -> 파일 업로드 시 중복되는 이름을 방지할 수 있는 객체!

         // 데이터 수집
         
         String title = multi.getParameter("title");
         String writer = multi.getParameter("writer");
         String content = multi.getParameter("content");
         String img = multi.getFilesystemName("filename");
         
         if(img==null) {
            img ="blank";
         }

         // 기능 처리
         // BoardDAO ->
         // Board -> table 기반으로 컬럼 관리하는 클래스
         Board board = new Board();
         board.setTitle(title);
         board.setWriter(writer);
         board.setFilename(img);
         board.setContent(content);
         
         BoardDAO dao = new BoardDAO();
         int cnt = dao.write(board);
         
         // view 처리
         
         if (cnt>0) {
            moveurl = "goBoard.do";
         } else {
            moveurl = "goWrite.do";
         }
                           
      } else if (result.equals("/LoginService.do")) {
         String email = request.getParameter("email");
         String pw = request.getParameter("pw");
         
         // 3. 기능 처리
         WebMemberDAO dao = new WebMemberDAO();
         WebMember member = new WebMember();
         
         member.setEmail(email);
         member.setPw(pw);
         
         WebMember info = dao.login(member);
         
         // 4. view 처리

         
         if(info != null ) {
            // 로그인 성공시
            // 해당하는 회원의 정보를 session 영역에 저장!
            // -> 메인
            HttpSession session = request.getSession();
            session.setAttribute("info", info);   
         }
         
         moveurl = "goMain.do";
      } 
      
      // 공통적으로 페이지 이동! 
      RequestDispatcher rd = request.getRequestDispatcher(moveurl);
      rd.forward(request, response);
   
      
   }

}