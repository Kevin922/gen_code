package com.diligrp.transmit.utils;


import java.lang.reflect.Method;

/**
 * Bean工具
 * User: juqkai (juqkai@gmail.com)
 * Date: 13-9-29 上午10:21
 */
public class BeanUtil {
    /**
     * 合并对象
     * 合并两个相同类型的对象, 如果update属性为空则不进行合并, 否则直接将update中的属性赋值给obj
     * @param old
     * @param newly
     */
    public static<T> T merge(T old, T newly){
        if(!old.getClass().isAssignableFrom(newly.getClass())){
            return old;
        }

        Method[] methods = old.getClass().getMethods();

        for(Method fromMethod: methods){
            if(fromMethod.getDeclaringClass().equals(old.getClass())
                    && fromMethod.getName().startsWith("get")){

                String fromName = fromMethod.getName();
                String toName = fromName.replace("get", "set");

                try {
                    Method toMetod = old.getClass().getMethod(toName, fromMethod.getReturnType());
                    Object value = fromMethod.invoke(newly, (Object[])null);
                    if(value != null){
                        toMetod.invoke(old, value);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        return old;
    }



}

