package com.smhrd.db;

import java.io.InputStream;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

public class SqlSessionManager {
	
	private static SqlSessionFactory sqlSessionFactory;
	
	static{
		// DB에 대한 기능을 사용할 수 있는 Factory 생성하는 클래스!
		try {
			String resource = "com/smhrd/db/config.xml";
			InputStream inputStream = Resources.getResourceAsStream(resource);
			sqlSessionFactory = 
					new SqlSessionFactoryBuilder().build(inputStream);
			
		}catch(Exception e) {
			e.printStackTrace();
		}
	}
	
	// Factory용 getter 메소드 
	public static SqlSessionFactory getsqlSession() {
		return sqlSessionFactory;
	}
	
	
	
	
	
}
	
