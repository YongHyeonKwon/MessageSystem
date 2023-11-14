package com.smhrd.controller;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.smhrd.model.MessageDAO;


@WebServlet("/DeleteOne")
public class DeleteOne extends HttpServlet {
	private static final long serialVersionUID = 1L;

	
	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		// 메세지 선택시 해당 메세지를 삭제하는 Controller
		// url로 넘어오는 데이터 받아주기! 
		
		String num = request.getParameter("num");
		
		MessageDAO dao = new MessageDAO();
		int cnt = dao.deleteOne(num);
		
		// 1. dao 클래스에 deleteOne() 메소드 생성
		// 2. MessageMapper.xml -> 메세지를 삭제하는 sql구문 생성하기
		
		
		
		RequestDispatcher rd = request.getRequestDispatcher("goMain");
		rd.forward(request, response);
		
		
	}

}
