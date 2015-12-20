/*
 * Copyright (c) 2014 www.diligrp.com All rights reserved.
 * 本软件源代码版权归----所有,未经许可不得任意复制与传播.
 */
package com.diligrp.titan.service.base;

import java.io.Serializable;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.diligrp.titan.dao.base.BaseDao;
import com.diligrp.titan.domain.common.Page;
import com.diligrp.titan.domain.common.TitanSequence;

/**
 * service实现类
 * 
 * @author dev-center
 * @since 2014-05-10
 * @param <T>
 *            实体
 * @param <KEY>
 *            主键
 */
public abstract class BaseServiceImpl<T, KEY extends Serializable> implements BaseService<T, KEY> {
	protected static final Logger LOGGER = LoggerFactory.getLogger(BaseServiceImpl.class);
	
	/**
	 * 获取DAO操作类
	 */
	public abstract BaseDao<T, KEY> getDao();

	public int insertEntry(T... t) {
		return getDao().insertEntry(t);
	}

	public int insertEntryCreateId(T t) throws Exception {
		return getDao().insertEntryCreateId(t);
	}

	public int deleteByKey(KEY... key) {
		return getDao().deleteByKey(key);
	}

	public int deleteByCondtion(T condtion) {
		return getDao().deleteByKey(condtion);
	}

	public int updateByKey(T condtion) {
		return getDao().updateByKey(condtion);
	}

	public int saveOrUpdate(T t) {
		T r = selectEntry(t);
		if (r != null) {
			return this.updateByKey(t);
		}
		return this.insertEntry(t);
	}

	public T selectEntry(T t) {
		return getDao().selectEntry(t);
	}

	public List<T> selectEntryList(KEY... key) {
		return getDao().selectEntryList(key);
	}

	public List<T> selectEntryList(T condtion) {
		return getDao().selectEntryList(condtion);
	}
	
	public List<T> selectList(T condtion) {
		return getDao().selectList(condtion);
	}
	
	/**
	 * list显示
	 */
	public Page<T> selectListPage(T condtion, Page<T> page) throws Exception {
		try {
			Class<?> clz = condtion.getClass();
			clz.getMethod("setStartIndex", Integer.class).invoke(condtion, page.getStartIndex());
			clz.getMethod("setEndIndex", Integer.class).invoke(condtion, page.getEndIndex());
		} catch (Exception e) {
			throw new Exception("设置分页参数失败", e);
		}
		Integer size = getDao().selectListCount(condtion);
		if (size == null || size <= 0) {
			return page;
		}
		page.setTotalCount(size);
		page.setResult(this.selectList(condtion));
		return page;
	}
	
	public Page<T> selectPage(T condtion, Page<T> page) throws Exception {
		try {
			Class<?> clz = condtion.getClass();
			clz.getMethod("setStartIndex", Integer.class).invoke(condtion, page.getStartIndex());
			clz.getMethod("setEndIndex", Integer.class).invoke(condtion, page.getEndIndex());
		} catch (Exception e) {
			throw new Exception("设置分页参数失败", e);
		}
		Integer size = getDao().selectEntryListCount(condtion);
		if (size == null || size <= 0) {
			return page;
		}
		page.setTotalCount(size);
		page.setResult(this.selectEntryList(condtion));
		return page;
	}


}
