package com.smhrd.controller;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.smhrd.model.WebMember;
import com.smhrd.model.WebMemberDAO;


@WebServlet("/JoinService")
public class JoinService extends HttpServlet {
	private static final long serialVersionUID = 1L;


	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		request.setCharacterEncoding("UTF-8");
		
		String email = request.getParameter("email");
		String pw= request.getParameter("pw");
		String tel = request.getParameter("tel");
		String address = request.getParameter("address");
				
		// DAO
		WebMemberDAO dao = new WebMemberDAO();
		WebMember member = new WebMember(email, pw, tel, address);
		
		int cnt = dao.join(member);
		
		String url = "";
		
		if(cnt > 0) {
			url = "WEB-INF/JoinSuccess.jsp";
			request.setAttribute("email", email);
		}else {
			url = "WEB-INF/Main.jsp";
		}
		
		RequestDispatcher rd = request.getRequestDispatcher(url);
		rd.forward(request, response);
		
		
		
	}

}
