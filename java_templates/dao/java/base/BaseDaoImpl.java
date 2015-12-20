/*
 * Copyright (c) 2014 www.diligrp.com All rights reserved.
 * 本软件源代码版权归----所有,未经许可不得任意复制与传播.
 */
package com.diligrp.titan.dao.base;

import com.diligrp.titan.domain.common.TitanSequence;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;

/**
 * dao实现类
 * 
 * @author dev-center
 * @since 2014-05-10
 * @param <T>
 *            实体
 * @param <KEY>
 *            主键
 */
public abstract class BaseDaoImpl<T, KEY extends Serializable> extends MyBatisSupport implements BaseDao<T, KEY> {
	private static final String DEFAULT_INSERT_KEY = "insertEntry";
	private static final String DEFAULT_INSERT_LAST_SEQUENCE_KEY = "lastSequence";
	private static final String DEFAULT_DELETE_ARRAY_KEY = "deleteByArrayKey";
	private static final String DEFAULT_DELETE_CONDTION = "deleteByCondtion";
	private static final String DEFAULT_UPDATE_KEY = "updateByKey";
	private static final String DEFAULT_SELECT_ARRAY_KEY = "selectEntryArray";
	private static final String DEFAULT_SELECT_ENTITY_CONDTION = "selectEntry";
	private static final String DEFAULT_SELECT_CONDTION = "selectEntryList";
	private static final String DEFAULT_SELECT_CONDTION_COUNT = "selectEntryListCount";
	private static final String TITAN_PROCS_SEQUENCE = "com.diligrp.titan.TitanSequence.getSequence";

	/**
	 * 获取命名空间前缀
	 * 
	 * @param statement
	 * @return
	 */
	public abstract String getNameSpace(String statement);

	public int insertEntry(T... t) {
		int result = 0;
		if (t == null || t.length <= 0) {
			return result;
		}
		for (T o : t) {
			if (o != null) {
				result += this.insert(getNameSpace(DEFAULT_INSERT_KEY), o);
			}
		}
		return result;
	}

	public int insertEntryCreateId(T t) {
		@SuppressWarnings("unchecked")
		int result = this.insertEntry(t);
		if (result > 0) {
			Integer id = (Integer) select(getNameSpace(DEFAULT_INSERT_LAST_SEQUENCE_KEY), null);
			if (id != null && id > 0) {
				try {
					Class<?> clz = t.getClass();
					clz.getMethod("setId", Integer.class).invoke(t, id);// 最后一次插入编号
				} catch (Exception e) {
					throw new AppException("设置新增主键失败", e);
				}
			}
		}
		return result;
	}

	public int deleteByKey(KEY... key) {
		return this.delete(getNameSpace(DEFAULT_DELETE_ARRAY_KEY), key);
	}

	public int deleteByKey(T t) {
		return this.delete(getNameSpace(DEFAULT_DELETE_CONDTION), t);
	}

	public int updateByKey(T t) {
		return this.update(getNameSpace(DEFAULT_UPDATE_KEY), t);
	}

	public T selectEntry(T t) {
		@SuppressWarnings("unchecked")
		T r = this.select(getNameSpace(DEFAULT_SELECT_ENTITY_CONDTION), t);
		if (r != null) {
			return r;
		}
		return null;
	}

	public List<T> selectEntryList(KEY... key) {
		if (key == null || key.length <= 0) {
			return null;
		}
		return this.selectList(getNameSpace(DEFAULT_SELECT_ARRAY_KEY), key);
	}

	public List<T> selectEntryList(T t) {
		return this.selectList(getNameSpace(DEFAULT_SELECT_CONDTION), t);
	}

	public Integer selectEntryListCount(T t) {
		return this.select(getNameSpace(DEFAULT_SELECT_CONDTION_COUNT), t);
	}

	@Deprecated()
	public List<T> selectList(T t) {
		return this.selectList("selectList", t);
	}

	@Deprecated()
	public Integer selectListCount(T t) {
		return this.select("selectListCount", t);
	}

}
