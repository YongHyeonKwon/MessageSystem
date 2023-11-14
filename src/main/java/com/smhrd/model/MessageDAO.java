package com.smhrd.model;

import java.util.ArrayList;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.smhrd.db.SqlSessionManager;

public class MessageDAO {

	SqlSessionFactory sqlSessionFactory 
		= SqlSessionManager.getsqlSession();
	
	// 메세지 보내기 
	public int insertMsg(Message msg) {
		SqlSession sqlSession = sqlSessionFactory.openSession(true);
		
		int cnt = sqlSession.insert("insertMsg", msg);
		
		sqlSession.close();
		
		return cnt;
	}
	
	// 메세지 확인하기 
	
	ArrayList<Message> list = new ArrayList<>();
	
	public ArrayList<Message> showMessage(String email) {
		
		SqlSession sqlSession = sqlSessionFactory.openSession(true);
		
		list = (ArrayList) sqlSession.selectList("selectAll", email);
		
		return list;
	}
	
	// 메세지 삭제하기 
	
	public int deleteOne(String num) {
		
		SqlSession sqlSession = sqlSessionFactory.openSession(true);
		
		int cnt = sqlSession.delete("deleteOne", num);
		
		sqlSession.close();
		
		return cnt;
	}
	
	
	
}
