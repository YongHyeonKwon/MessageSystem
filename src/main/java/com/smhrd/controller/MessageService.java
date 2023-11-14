package com.smhrd.controller;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.smhrd.model.Message;
import com.smhrd.model.MessageDAO;


@WebServlet("/MessageService")
public class MessageService extends HttpServlet {
	private static final long serialVersionUID = 1L;


	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		// 1. 인코딩 
		request.setCharacterEncoding("UTF-8");
		
		// 2. 데이터 수집 (메세지 작성시 데이터 찾아오기)
		// - sendName, receiveEmail, message
		String sendName = request.getParameter("sendName");
		String receiveEmail = request.getParameter("receiveEmail");
		String message = request.getParameter("message");
		
		// 3. 기능처리 
		// DAO 접근, 보내고자 하는 데이터 전달
		// 처리결과 받아오기 
		MessageDAO dao = new MessageDAO();
		Message msg = new Message();
		
		msg.setSendName(sendName);
		msg.setReceiveEmail(receiveEmail);
		msg.setMessage(message);
		
		int cnt = dao.insertMsg(msg);
		
		// 4. view 처리 
		// 성공/실패 -> Main.jsp 이동
		
		if(cnt > 0) {
			RequestDispatcher rd = request.getRequestDispatcher("goMain");
			rd.forward(request, response);
		}
		
		
	}

}
