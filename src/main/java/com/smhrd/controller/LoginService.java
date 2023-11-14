package com.smhrd.controller;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.smhrd.model.WebMember;
import com.smhrd.model.WebMemberDAO;


@WebServlet("/LoginService")
public class LoginService extends HttpServlet {
	private static final long serialVersionUID = 1L;


	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		System.out.println("check");
		request.setCharacterEncoding("UTF-8");
		
		String email = request.getParameter("email");
		String pw = request.getParameter("pw");
		
		WebMemberDAO dao = new WebMemberDAO();
		WebMember member = new WebMember();
		member.setEmail(email);
		member.setPw(pw);
		
		WebMember info = dao.login(member);
		
		if(info != null) {
			// 로그인 성공 시
			// 해당하는 회원의 정보를 session 영역에 저장!
			// -> Main으로 이동
			HttpSession session = request.getSession();
			session.setAttribute("info", info);
		}
		
		RequestDispatcher rd = request.getRequestDispatcher("goMain");
		rd.forward(request, response);
		
	}

}
