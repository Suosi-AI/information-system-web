import React, { useState, useEffect, useCallback } from 'react';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import Icon from '@/components/Icon';
import moment from 'moment';
import axios from 'axios';
import {
  PlusOutlined,
  YuqueOutlined,
  FolderOpenOutlined,
  FolderOutlined,
  DeleteOutlined,
  EditOutlined,
  SettingOutlined,
} from '@ant-design/icons';

import styles from './index.less';
import {
  Spin,
  DatePicker,
  Checkbox,
  Pagination,
  Button,
  Input,
  Tabs,
  Menu,
  Modal,
  Dropdown,
  Popconfirm,
  message,
  Form,
  Divider,
  Empty,
  Radio,
  Select,
  Table,
} from 'antd';
import DashboardCard from './../../components/common/DashboardCard';
import ActionStats from '@/components/common/ActionStats';
import CardModal from './../../components/common/CardModal';
import SocialEditor from '@/components/common/SocialEditor';

import weibo from './../../assets/images/icon/weibo.png';
import weixin from './../../assets/images/icon/weixin.png';
import google from './../../assets/images/icon/google.png';
import blog from './../../assets/images/icon/blog.png';
import wangzhan from './../../assets/images/icon/new.png';
import baidu from './../../assets/images/icon/baidu.png';
import twitter from './../../assets/images/icon/twitter.png';
import facebook from './../../assets/images/icon/facebook.png';
import youtube from './../../assets/images/icon/youtube.png';
import telegram from './../../assets/images/icon/telegram.png';
const { RangePicker } = DatePicker;
const { Search, TextArea } = Input;
const plainOptions = ['微博', '公众号', '谷歌', '博客', '网站', '推特', '百度', '油管', '脸书', '电报'];
const defaultCheckedList = [''];

const CheckboxGroup = Checkbox.Group;
import {
  getMonitorTargetNewsPage,
  getInfo,
  getList,
  getSave,
  getUpdate,
  getDelete,
  exportNewsToExcel,
  downNewsWord,
  exportNewsToWordZip,
  getUserList,
  saveViewPermission,
} from './../../services/store';
import img from '@/assets/images/logo.png';
import { error } from 'bfj/src/events';

const dynamicImg = sourceType => {
  switch (sourceType) {
    case '微博':
      return weibo;
    case '公众号':
      return weixin;
    case '谷歌':
      return google;
    case '博客':
      return blog;
    case '网站':
      return wangzhan;
    case '百度':
      return baidu;
    case '推特':
      return twitter;
    case '脸书':
      return facebook;
    case '油管':
      return youtube;
    case '电报':
      return telegram;

    default:
      return '';
  }
};

export default function Social() {
  //定义的字段在哪，正在找
  const [row, setRow] = useState({ name: '' });
  const [currentMonitor, setCurrentMonitor] = useState({});
  const [selectedRange, setSelectedRange] = useState('1m');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [dateRange, setDateRange] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [recordsCount, setRecordsCount] = useState(0);

  const [isExportMode, setIsExportMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAlertModalVisible, setIsAlertModalVisible] = useState(false);
  const [currentCardData, setCurrentCardData] = useState(null);

  const [firstLevelArchives, setFirstLevelArchives] = useState([]);
  const [secondLevelArchives, setSecondLevelArchives] = useState({});
  const [selectedFirstLevelArchiveId, setSelectedFirstLevelArchiveId] = useState(null);
  const [selectedSecondLevelArchiveId, setSelectedSecondLevelArchiveId] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [isSocialEditorVisible, setIsSocialEditorVisible] = React.useState(false);
  const [mockData, setMockData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchKeywords, setSearchKeywords] = useState('');
  const [modalData, setModalData] = useState({});
  const [newMonitor, setNewMonitor] = useState({ name: '', matchConditions: '' });
  // 媒体范围
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);

  const [targetMatchedCondition, setTargetMatchedCondition] = useState('');
  const [monitorName, setMonitorName] = useState('');
  const [isInitialFetch, setIsInitialFetch] = useState(true);
  const [shouldFetchData, setShouldFetchData] = useState(false);

  const [selectedIds, setSelectedIds] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [isAlert, setIsAlert] = useState(false);

  const [isPermissionModalVisible, setIsPermissionModalVisible] = useState(false);
  const [currentPermissionItem, setCurrentPermissionItem] = useState(null);
  const [permissionType, setPermissionType] = useState(1); // 1: 仅自己可见, 2: 指定用户可见
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userList, setUserList] = useState([]);

  const calculateTimeRange = range => {
    const endDate = new Date(); // 结束时间为当前时间
    let startTime;

    switch (range) {
      case '24h':
        startTime = new Date(endDate.getTime() - 3600 * 1000 * 24 * 1); // 24小时
        break;
      case '1w':
        startTime = new Date(endDate.getTime() - 3600 * 1000 * 24 * 7); // 一周
        break;
      case '1m':
        startTime = new Date(endDate.getTime() - 3600 * 1000 * 24 * 30); // 一月
        break;
      case '1y':
        startTime = new Date(endDate.getTime() - 3600 * 1000 * 24 * 365); // 一年
        break;
      default:
        startTime = null;
    }

    const formatTime = date => {
      return date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : '';
    };

    return {
      startTime: formatTime(startTime),
      endTime: formatTime(new Date()),
    };
  };

  const handleRangeChange = range => {
    console.log(range, totalCount);

    setSelectedRange(range);

    if (range !== 'custom') {
      const { startTime, endTime } = calculateTimeRange(range);
      setDateRange([
        moment(startTime, 'YYYY-MM-DD HH:mm:ss'),
        moment(endTime, 'YYYY-MM-DD HH:mm:ss'),
      ]);
    }
  };

  const handleDateChange = (dates, dateStrings) => {
    setDateRange(dates);
  };

  const handleLanguageChange = language => {
    setSelectedLanguage(language);
  };

  const handleSearch = searchQuery => {
    setCurrentPage(1);
    setSearchQuery(searchQuery);
    setSearchKeywords(searchQuery);
  };
  // const highLight = (text, keyword, targetMatchedCondition) => {
  //   if (!keyword || keyword.trim() === '') {
  //     return text;
  //   }
  //   const regexKeyword = new RegExp(`(${keyword})`, 'gi');
  //   const regexCondition = new RegExp(`(${targetMatchedCondition})`, 'gi');
    
  //   const parts = text.split(regexKeyword).flatMap(part => 
  //     part.split(regexCondition).map((subPart, index) => {
  //       if (regexCondition.test(subPart)) {
  //         return (
  //           <span key={`condition-${index}`} style={{ color: 'blue' }}>
  //             {subPart}
  //           </span>
  //         );
  //       } else if (regexKeyword.test(subPart)) {
  //         return (
  //           <span key={`keyword-${index}`} style={{ color: 'red' }}>
  //             {subPart}
  //           </span>
  //         );
  //       } else {
  //         return subPart;
  //       }
  //     })
  //   );

  //   return parts;
  // };

  const highLight = (text, keyword, targetMatchedCondition) => {
  if (!text || !isAlert) return text;
  
  // 解析匹配条件
  const parseMatchCondition = (condition) => {
    if (!condition) return [];
    
    // 分解AND条件
    return condition.split('+').flatMap(andPart => {
      const parts = andPart.trim().split('-');
      const matches = [];
      
      // 处理第一部分（可能包含OR条件）
      if (parts[0]) {
        const orPart = parts[0].trim();
        if (orPart.startsWith('(') && orPart.endsWith(')')) {
          // 处理括号内的OR条件
          const orTerms = orPart.substring(1, orPart.length - 1).split('|');
          matches.push(...orTerms.map(term => term.trim()));
        } else {
          matches.push(orPart);
        }
      }
      
      return matches;
    });
  };

  // 获取所有需要高亮的词组
  const highlightTerms = parseMatchCondition(targetMatchedCondition);
  
  // 创建正则表达式模式
  const keywordPattern = keyword ? `(${keyword})` : '';
  const termsPattern = highlightTerms.length > 0 ? 
    `(${highlightTerms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})` : '';
  
  // 构建组合的正则表达式
  const patterns = [keywordPattern, termsPattern]
    .filter(Boolean)
    .join('|');
    
  if (!patterns) return text;
  
  const regex = new RegExp(patterns, 'gi');
  
  // 分割文本并添加高亮
  const parts = text.split(regex);
  
  return parts.map((part, index) => {
    // 检查是否匹配关键词
    if (keyword && new RegExp(keywordPattern, 'gi').test(part)) {
      return (
        // <span key={`keyword-${index}`} className="highlight-keyword">
        // eslint-disable-next-line react/no-array-index-key
        <span key={`keyword-${index}`} style={ {color: 'red'}}>
          {part}
        </span>
      );
    }
    
    // 检查是否匹配条件词
    if (highlightTerms.some(term => new RegExp(`^${term}$`, 'i').test(part))) {
      return (
        // <span key={`condition-${index}`} className="highlight-condition">
        // eslint-disable-next-line react/no-array-index-key
        <span key={`condition-${index}`} style={ {color: 'red'}}>
          {part}
        </span>
      );
    }
    
    return part;
  });
};


  const onChange = list => {
    // 如果列表长度等于选项总数，则全选，设置为空数组
    // 如果列表长度为0，则全不选，也设置为空数组
    if (list.length === plainOptions.length || list.length === 0) {
      setCheckedList(list);
      setIndeterminate(false);
      setCheckAll(list.length === plainOptions.length);
    } else {
      setCheckedList(list);
      setIndeterminate(list.length !== plainOptions.length && list.length !== 0);
      setCheckAll(list.length === plainOptions.length);
    }
  };
  const onCheckAllChange = e => {
    const newCheckedList = e.target.checked ? plainOptions : [];
    setCheckedList(newCheckedList);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  useEffect(() => {
    fetchFirstLevelArchives();
  }, []);

  // 修改fetchListData的调用条件，仅当isInitialFetch为false时才调用
  useEffect(() => {
    if (shouldFetchData) {
      fetchListData();
      setShouldFetchData(true);
    }
  }, [
    currentPage,
    selectedFirstLevelArchiveId,
    selectedRange,
    selectedLanguage,
    dateRange,
    searchQuery,
    checkedList,
    // targetMatchedCondition, // 添加依赖项。不应该是弹窗关闭的时候主动调接口吗，关闭？
    shouldFetchData, // 添加依赖项
    isEditing,
  ]);

  // 在设置targetMatchedCondition时，更新isInitialFetch状态，看你那个错误。我就已经知道问题在哪了。你想一想为啥会发，哪个问题重复调用吗
  useEffect(() => {
    if (firstLevelArchives.length > 0 && isInitialFetch) {
      setTargetMatchedCondition(firstLevelArchives[0].targetMatchedCondition);
      setSelectedFirstLevelArchiveId(firstLevelArchives[0].id);
      setIsInitialFetch(false);
    }
  }, [firstLevelArchives]);

  useEffect(() => {
    setCurrentPage(1);
    setMockData([]);
  }, [selectedFirstLevelArchiveId]);

  // 获取一级档案数据
  const fetchFirstLevelArchives = async () => {
    try {
      const response = await getList();
      //   {
      //   page: currentPage.toString(),
      //   limit: pageSize.toString(),
      // }
      if (response.code === 200) {
        const firstLevelData = response.data.map(item => ({
          id: item.target_id,
          name: item.target_name,
          targetMatchedCondition: item.target_matched_condition,
        }));
        setFirstLevelArchives(firstLevelData);
        setShouldFetchData(true);
        if (firstLevelData.length > 0) {
          setMonitorName(firstLevelData[0].name);
          setTargetMatchedCondition(firstLevelData[0].targetMatchedCondition);
          setSelectedFirstLevelArchiveId(firstLevelData[0].id);
        }
      }
    } catch (error) {
      console.error('获取一级监测数据失败:', error);
    }
  };

  const handleMonitorItemClick = async id => {
    setSelectedIds([]); // 清空选中的ID
    setIsExportMode(false); // 关闭复选框显示
    const selectedArchive = firstLevelArchives.find(item => item.id === id);
    if (selectedArchive) {
      const newExpanded = { ...expanded };
      for (const key in newExpanded) newExpanded[key] = false;
      newExpanded[id] = true;
      setExpanded(newExpanded);
      setSelectedFirstLevelArchiveId(id);
      setSelectedSecondLevelArchiveId(null);
      setCurrentPage(1);
      setTargetMatchedCondition(selectedArchive.targetMatchedCondition); // 设置匹配条件
      setMonitorName(selectedArchive.name);
      setShouldFetchData(true);
    }
  };

  const handleAddMonitor = () => {
    setIsEditing(false); // 设置为新增状态
    setNewMonitor({ name: '', matchConditions: '' }); // 清空输入框状态
    setMonitorName(''); // 清空监测目标名称
    setTargetMatchedCondition(''); // 清空匹配条件
    setIsSocialEditorVisible(true); // 显示编辑器
  };

  // 新闻列表
  const fetchListData = async () => {
    setIsLoading(true);
    try {
      let startTime, endTime;

      if (selectedRange === 'custom' && dateRange.length) {
        startTime = dateRange[0].format('YYYY-MM-DD HH:mm:ss');
        endTime = dateRange[1].format('YYYY-MM-DD HH:mm:ss');
      } else {
        const { startTime: calculatedStartTime, endTime: calculatedEndTime } =
          calculateTimeRange(selectedRange);
        startTime = calculatedStartTime;
        endTime = calculatedEndTime;
      }

      const response = await getMonitorTargetNewsPage({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        startTime,
        endTime,
        lang: selectedLanguage || '',
        searchContent: searchQuery || '',
        targetMatchedCondition: targetMatchedCondition,
        sourceType: checkedList.length === plainOptions.length ? '' : checkedList.join(','),
      });
      setMockData(response.page.list);
      setTotalCount(response.page.totalCount);
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleModalVisibility = isVisible => {
    setIsModalVisible(isVisible);
  };

  const handleAlertModalVisibility = isVisible => {
    setIsAlertModalVisible(isVisible);
  };
  const handleEditClick = (id, event) => {
    const selectedArchive = firstLevelArchives.find(archive => archive.id === id);
    if (selectedArchive) {
      setCurrentMonitor(selectedArchive);
      setIsEditing(true);
      setEditingId(id);
      setIsSocialEditorVisible(true);
      setMonitorName(selectedArchive.name); // 设置编辑器中的名称为选中的监测目标名称
      setTargetMatchedCondition(selectedArchive.targetMatchedCondition); // 设置编辑器中的匹配条件为选中的监测目标匹配条件
    }
  };
  const handleSaveMonitor = async () => {
    try {
      let response;
      const saveData = {
        targetName: monitorName,
        targetMatchedCondition: targetMatchedCondition,
      };

      if (isEditing) {
        // 在编辑状态下，确保更新currentMonitor对象的name和targetMatchedCondition
        const updatedMonitor = {
          // ...currentMonitor,
          targetName: monitorName, // 使用最新的monitorName
          targetMatchedCondition: targetMatchedCondition, // 使用最新的targetMatchedCondition
        };
        updatedMonitor.targetId = editingId;

        if (!monitorName) {
          alert('请输入监测目标名称');
          return;
        } else if (!targetMatchedCondition) {
          alert('请输入匹配条件');
          return;
        }
        response = await getUpdate(updatedMonitor);
      } else {
        if (!monitorName) {
          alert('请输入监测目标名称');
          return;
        } else if (!targetMatchedCondition) {
          alert('请输入匹配条件');
          return;
        }
        // 新增监测目标
        response = await getSave(saveData);
      }

      if (response.code === 200) {
        message.success(isEditing ? '编辑监测目标成功' : '添加监测目标成功');
        setIsSocialEditorVisible(false);
        setShouldFetchData(true); // 设置标志，表示需要重新获取数据
        await fetchFirstLevelArchives(); // 重新获取监测目标列表
      } else {
        message.error(`操作失败：${response.msg}`);
      }
    } catch (error) {
      console.error('操作失败:', error);
    }
  };

  const confirmDelete = async (id, event) => {
    event.stopPropagation(); // 阻止事件冒泡
    try {
      const response = await getDelete({ targetId: id });

      if (response.code === 200) {
        await fetchFirstLevelArchives();
        message.success('删除成功');
      } else {
        message.error(`操作失败：${response.msg}`);
      }
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  const handleCancel = () => {
    console.log('取消操作');
    setIsSocialEditorVisible(false);
  };

  const handleContentClick = async (id, showActions) => {
    console.log(showActions, 'showActions');

    try {
      const response = await getInfo({ newsId: id });

      if (response.code === 200 && response.data) {
        setModalData(modalData => ({
          ...modalData,
          ...response.data,
          showActions: showActions,
          searchQuery: searchQuery,
        }));
      } else {
        message.error(`操作失败：${response.msg}`);
      }
    } catch (error) {
      console.error('获取失败:', error);
      message.error('获取时发生错误');
    }
    handleModalVisibility(true);
  };

  const handleExport = id => {
    const newsId = id;

    downNewsWord({ newsId })
      .then(resp => {
        // 创建 Blob 对象
        const blob = new Blob([resp], { type: 'application/vnd.ms-word;charset=utf-8' });

        // 生成 URL
        const url = window.URL.createObjectURL(blob);

        // 创建一个 <a> 元素并设置相关属性
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.download = '新闻.doc'; // 设置下载文件的名称

        // 将 <a> 元素添加到页面中并触发点击
        document.body.appendChild(link);
        link.click();

        // 清理操作
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        message.success('导出成功!');
      })
      .catch(error => {
        console.error('导出失败:', error);
        message.error('导出失败: ' + error.message);
      });
  };

  // 收集当前页新闻ID的方法
  const collectCurrentPageNewsIds = () => {
    const currentIds = mockData.map(item => item.id); // 假设mockData是当前页新闻数据的数组
    return currentIds;
  };

  // 手动选中新闻id
  const handleSelectChange = (id, checked) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    }

    // 更新全选状态
    // const allSelected = mockData.every(item => selectedIds.includes(item.id));
    // setIsAllSelected(allSelected);
  };

  const handleSelectAll = () => {
    const currentIds = mockData.map(item => item.id);
    if (isAllSelected) {
      setSelectedIds(selectedIds.filter(id => !currentIds.includes(id)));
    } else {
      setSelectedIds([...selectedIds, ...currentIds]);
    }
    setIsAllSelected(!isAllSelected);
  };
  const handleExportModeToggle = () => {
    setIsExportMode(!isExportMode); // 切换 isExportMode 的值

    if (isExportMode) {
      setSelectedIds([]); // 清空选中的ID
    }
  };

  // 导出为Excel的方法
  const handleExportToExcel = () => {
    // const newsId = collectCurrentPageNewsIds();
    // let newsIdL = {
    //   newsIdList: newsId,
    // };
    if (selectedIds.length === 0) {
      message.error('请选择要导出的新闻');
      return;
    }

    let newsIdL = {
      newsIdList: selectedIds,
    };

    exportNewsToExcel(newsIdL)
      .then(resp => {
        // 创建 Blob 对象
        const blob = new Blob([resp], { type: 'application/vnd.ms-xls;charset=utf-8' });

        // 生成 URL
        const url = window.URL.createObjectURL(blob);

        // 创建一个 <a> 元素并设置相关属性
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.download = '新闻列表.xls'; // 设置下载文件的名称

        // 将 <a> 元素添加到页面中并触发点击
        document.body.appendChild(link);
        link.click();

        // 清理操作
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        message.success('导出成功!');
        setSelectedIds([]); // 清空选中的ID
        setIsExportMode(false); // 关闭复选框显示
      })
      .catch(error => {
        console.error('导出为Excel失败:', error);
        message.error('导出为Excel失败');
      });
  };

  // 导出多个Word压缩成Zip的方法
  const handleExportToWordZip = () => {
    if (selectedIds.length === 0) {
      message.error('请选择要导出的新闻');
      return;
    }

    let newsIdL = {
      newsIdList: selectedIds,
    };

    exportNewsToWordZip(newsIdL)
      .then(resp => {
        // 创建 Blob 对象
        const blob = new Blob([resp], { type: 'application/vnd.ms-zip;charset=utf-8' });

        // 生成 URL
        const url = window.URL.createObjectURL(blob);

        // 创建一个 <a> 元素并设置相关属性
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.download = '新闻列表.zip'; // 设置下载文件的名称

        // 将 <a> 元素添加到页面中并触发点击
        document.body.appendChild(link);
        link.click();

        // 清理操作
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        message.success('导出成功!');
        setSelectedIds([]); // 清空选中的ID
        setIsExportMode(false); // 关闭复选框显示
      })
      .catch(error => {
        console.error('导出为Excel失败:', error);
        message.error('导出为Excel失败');
      });
  };

  const menu = (
    <Menu>
      <Menu.Item key="excel" onClick={handleExportToExcel}>
        导出为Excel
      </Menu.Item>
      <Menu.Item key="wordZip" onClick={handleExportToWordZip}>
        导出为WordZip
      </Menu.Item>
    </Menu>
  );

  const handleCollect = (cardId, isCollected) => {
    console.log('Card ID:', cardId, 'is now', isCollected ? 'collected' : 'not collected');
    // 实现收藏逻辑
  };

  const fetchUserList = async () => {
    try {
      const response = await getUserList();
      if (response.code === 200) {
        setUserList(response.list || []);
      }
    } catch (error) {
      console.error('获取用户列表失败:', error);
    }
  };

  const handlePermissionClick = (item, event) => {
    event.stopPropagation();
    setCurrentPermissionItem(item);
    setIsPermissionModalVisible(true);
    fetchUserList(); // 获取用户列表
  };

  const handlePermissionSave = async () => {
    // 前端假配置，不走后端
      message.success('权限配置保存成功');
      setIsPermissionModalVisible(false);
    // try {
    //   const params = {
    //     targetType: permissionType,
    //     targetUserIds: selectedUsers,
    //     monitorId: currentPermissionItem.id, // 监测目标ID
    //   };
      
    //   const response = await saveViewPermission(params);
    //   if (response.code === 200) {
    //     message.success('权限配置保存成功');
    //     setIsPermissionModalVisible(false);
    //   } else {
    //     message.error(response.msg || '保存失败');
    //   }
    // } catch (error) {
    //   console.error('保存权限配置失败:', error);
    //   message.error('保存失败');
    // }
  };

  // 样例数据
  // const dataSource = Array.from({ length: 10 }, (v, i) => ({
  //   key: i + 1,
  //   time: `2023-10-0${i + 1} 12:00:00`,
  //   content: `告警内容 ${i + 1}`,
  //   source: `来源 ${i + 1}`,
  // }));

  const dataSource = [
    {
      key: 1,
      time: "2025-01-01 10:00:00",
      content: "阿布扎比在 MIPCOM 2024 上推出新现金返还，最低 35%++",
      source: "台湾英文新闻",
    },
    {
      key: 2,
      time: "2024-12-31 10:00:00",
      content: "成龙房祖名一家三代亮相JCE群星宴(6)",
      source: "台湾英文新闻",
    },
    {
      key: 3,
      time: "2024-12-30 20:10:00",
      content: "《沉睡在大海的钻石》是一部历史杰作，华丽的演员阵容向国村淳表示感谢“在日剧中……”",
      source: "谷歌",
    },
    {
      key: 4,
      time: "2024-12-29 10:00:60",
      content: "消息：美拟把向华为供管制晶片的中国公司列黑名单",
      source: "联合早报",
    },
    {
      key: 5,
      time: "2024-12-29 02:00:00",
      content: "据报助华为获台积电晶片 算能科技被美列入黑名单",
      source: "日本每日新闻",
    },
    {
      key: 6,
      time: "2024-12-28 10:00:60",
      content: "日经亚洲编辑的来信：日产本田合并谈判和一个时代的结束",
      source: "日经亚洲",
    },
    {
      key: 7,
      time: "2024-12-26 12:20:00",
      content: "联华电子表示没有在美国建厂的计划",
      source: "台北时报",
    }
  ]

  const columns = [
    {
      title: '序号',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '告警内容',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const showAlertModal = () => {
    setIsAlertModalVisible(true);
  };
  const handleAlertCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.left}>
          <Button onClick={handleAddMonitor} icon={<PlusOutlined />} className={styles.btn}>
            添加监测目标
          </Button>
          <div>
            {firstLevelArchives.map(item => (
              <div key={item.id}>
                <div className={styles.listItem}>
                  {expanded[item.id] ? <FolderOpenOutlined /> : <FolderOutlined />}
                  <span className={styles.title} onClick={() => handleMonitorItemClick(item.id)}>
                    {item.name}
                  </span>
                  <React.Fragment>
                    <EditOutlined
                      className={styles.editIcon}
                      name="EditOutlined"
                      onClick={event => handleEditClick(item.id, event)}
                    />
                    <SettingOutlined 
                      className={styles.settingIcon}
                      onClick={event => handlePermissionClick(item, event)}
                    />
                    <Popconfirm
                      title="您确定要删除吗？"
                      onConfirm={event => confirmDelete(item.id, event)}
                      onCancel={() => console.log('Cancel clicked')}
                      okText="是"
                      cancelText="否"
                    >
                      <DeleteOutlined className={styles.deleteIcon} name="DeleteOutlined" />
                    </Popconfirm>
                  </React.Fragment>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Modal
          title={isEditing ? '编辑监测目标' : '添加监测目标'}
          visible={isSocialEditorVisible}
          onOk={handleSaveMonitor}
          onCancel={handleCancel}
          className={styles.modalSty}
        >
          <Form>
            <Form.Item label="监测目标名称">
              <Input
                value={monitorName}
                onChange={e => setMonitorName(e.target.value)}
                placeholder="监测目标名称"
              />
            </Form.Item>
            <Form.Item label="匹配条件">
              <TextArea
                rows={4}
                value={targetMatchedCondition}
                onChange={e => setTargetMatchedCondition(e.target.value)}
                placeholder="输入匹配条件，使用+-|组合对应逻辑表达式，例：(日本|海上保安厅)+军舰 进行筛选"
              />
            </Form.Item>
            <Form.Item label="告警功能">
              <Select
                defaultValue="关闭"
                onChange={value => {
                  if (value === '打开') {
                    // 触发高亮显示的逻辑
                    setIsAlert(true)
                  }
                }}
              >
                <Select.Option value="关闭">关闭</Select.Option>
                <Select.Option value="打开">打开</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
        <div className={styles.container1}>
          <div className={styles.countTop}>
            <div className={styles.searchTop}>
              <Search
                placeholder="请输入您要搜索的内容"
                allowClear
                onSearch={e => handleSearch(e)}
                style={{
                  width: 200,
                }}
              />
            </div>
            <div className={styles.timeSelect}>
              <span className={styles.curP}>时间范围：</span>
              <span
                className={`${styles.curP} ${selectedRange === '24h' ? styles.selected : ''}`}
                onClick={() => handleRangeChange('24h')}
              >
                近一天
              </span>
              <span
                className={`${styles.curP} ${selectedRange === '1w' ? styles.selected : ''}`}
                onClick={() => handleRangeChange('1w')}
              >
                近一周
              </span>
              <span
                className={`${styles.curP} ${selectedRange === '1m' ? styles.selected : ''}`}
                onClick={() => handleRangeChange('1m')}
              >
                近一月
              </span>
              <span
                className={`${styles.curP} ${selectedRange === '1y' ? styles.selected : ''}`}
                onClick={() => handleRangeChange('1y')}
              >
                近一年
              </span>
              <span
                className={`${styles.curP} ${selectedRange === 'custom' ? styles.selected : ''}`}
                onClick={() => handleRangeChange('custom')}
              >
                自定义
              </span>
              {selectedRange === 'custom' && (
                <RangePicker
                  locale={locale}
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  default-time={['00:00:00', '23:59:59']}
                  className="mar-l-10"
                  onChange={handleDateChange}
                />
              )}
            </div>
            <div className={styles.mediaSelect}>
              <span>媒体范围：</span>
              <Checkbox
                indeterminate={indeterminate}
                onChange={onCheckAllChange}
                checked={checkAll}
              >
                全选
              </Checkbox>
              <Divider />
              <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} />
            </div>
            <div className={styles.languageSelect}>
              <span className={styles.curP}>语种筛选：</span>
              <span
                className={`${styles.curP1} ${selectedLanguage === '' ? styles.selected : ''}`}
                onClick={() => handleLanguageChange('')}
              >
                全部
              </span>
              <span
                className={`${styles.curP1} ${selectedLanguage === '中文' ? styles.selected : ''}`}
                onClick={() => handleLanguageChange('中文')}
              >
                中文
              </span>
              <span
                className={`${styles.curP1} ${selectedLanguage === '繁体' ? styles.selected : ''}`}
                onClick={() => handleLanguageChange('繁体')}
              >
                繁体
              </span>
              <span
                className={`${styles.curP1} ${selectedLanguage === '日语' ? styles.selected : ''}`}
                onClick={() => handleLanguageChange('日语')}
              >
                日语
              </span>
              <span
                className = {
                    `${styles.curP1} ${selectedLanguage ===
 '英语' ? styles.selected : ''}`}
                onClick={() => handleLanguageChange('英语')}
              >
                英语
              </span>
              <span
                className={`${styles.curP1} ${selectedLanguage === '韩语' ? styles.selected : ''}`}
                onClick={() => handleLanguageChange('韩语')}
              >
                韩语
              </span>
              <span
                className={`${styles.curP1} ${selectedLanguage === '其他' ? styles.selected : ''}`}
                onClick={() => handleLanguageChange('其他')}
              >
                其他
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 20px 0 0 ',
              }}
            >
              <div>
                <span>
                  共<span style={{ color: '#FF8000', margin: '0 10px' }}>{totalCount}</span>
                  条记录
                </span>
              </div>

              {totalCount > 0 ? (
                <div>
                  {selectedIds.length > 0 && (
                    <span style={{ marginRight: 8 }}>
                      已选择
                      <span style={{ color: 'red', margin: '0 5px' }}>{selectedIds?.length}</span>
                      条新闻
                    </span>
                  )}
                  {/* {isExportMode && (
                    <Button
                      style={{
                        marginLeft: 8,
                        background: 'rgb(103 101 101 / 70%)',
                        color: 'white',
                      }}
                      onClick={handleSelectAll}
                    >
                      {isAllSelected ? '全不选' : '当页全选'}
                    </Button>
                  )} */}
                  <Dropdown overlay={menu} placement="bottom" onClick={handleExportModeToggle}>
                    <Button
                      style={{
                        backgroundColor: 'rgba(255, 128, 0, 0.5)',
                        color: 'white',
                        marginLeft: 8,
                      }}
                      disabled={selectedIds.length === 0}
                    >
                      批量导出
                    </Button>
                  </Dropdown>
                  <Button
                    style={{ marginLeft: 16 }}
                    onClick={showAlertModal}
                  >
                    告警日志
                  </Button>
                </div>
              ) : (
                <div>
                  <Button
                    style={{ backgroundColor: 'rgba(255, 128, 0, 0.5)', color: 'white' }}
                    disabled
                  >
                    批量导出
                  </Button>
                </div>
              )}
            </div>
          </div>
          {mockData.length === 0 && !isLoading ? (
            <Empty className={styles.empty} description={<div>暂无数据</div>} />
          ) : (
            <Spin style={{ marginTop: '30vh' }} tip="加载数据中..." spinning={isLoading}>
              {mockData.map((card, index) => {
                const processedCard = {
                  ...card,
                  titleZh: isAlert ? highLight(card.titleZh, searchQuery, targetMatchedCondition) : card.titleZh,
                  contentZh: isAlert ? highLight(card.contentZh, searchQuery, targetMatchedCondition) : card.contentZh,
                };

                return (
                  <div
                    key={card.id}
                    style={{
                      display: 'flex',
                      paddingLeft: '10px',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    {isExportMode && (
                      <Checkbox
                        value={card.id}
                        checked={selectedIds.includes(card.id)}
                        onChange={e => handleSelectChange(card.id, e.target.checked)}
                        style={{ marginRight: '10px' }}
                      />
                    )}
                    <DashboardCard
                      className={styles.dashboardCardStyle}
                      key={card.id}
                      img={dynamicImg(card.sourceType)}
                      sourceName={card.sourceName}
                      publishTime={card.publishTime}
                      title={processedCard.titleZh}
                      content={processedCard.contentZh}
                      link={card.url}
                      images={card.pics}
                      likeNum={card.likeNum}
                      commentNum={card.commentNum}
                      shareNum={card.shareNum}
                      readNum={card.readNum}
                      showActions={card.showActions}
                      onClickContent={() => handleContentClick(card.id, card.showActions)}
                      onCollect={isCollected => handleCollect(card.id, isCollected)}
                      onExport={() => handleExport(card.id)}
                      whetherCollect={card.whetherCollect}
                      newsId={card.id}
                      folderId={card.folderId}
                      onHandleJc={fetchListData}
                    />
                  </div>
                );
              })}
            </Spin>
          )}
          {mockData.length > 0 && (
            <Pagination
              current={currentPage}
              total={totalCount}
              pageSize={pageSize}
              onChange={(page, pageSize) => {
                setCurrentPage(page);
                setPageSize(pageSize);
                setIsAllSelected(false);
              }}
              onShowSizeChange={(current, size) => {
                setCurrentPage(1); // 重置到第一页
                setPageSize(size);
              }}
              style={{ margin: '10px auto', display: 'flex', justifyContent: 'center' }}
              showSizeChanger={false}
            />
          )}
        </div>
      </div>

      <CardModal
        visible={isModalVisible}
        onCancel={() => handleModalVisibility(false)}
        modalData={modalData}
        setIsModalVisible={handleModalVisibility}
        handleExport={() => handleExport(modalData.id)}
        images={modalData.pics}
        onHandleJc={fetchListData}
      />

      <Modal
        title="权限配置"
        visible={isPermissionModalVisible}
        onOk={handlePermissionSave}
        onCancel={() => setIsPermissionModalVisible(false)}
        destroyOnClose
      >
        <Form layout="vertical">
          <Form.Item label="可见范围">
            <Radio.Group 
              value={permissionType}
              onChange={e => setPermissionType(e.target.value)}
            >
              <Radio value={1}>仅自己可见</Radio>
              <Radio value={2}>指定用户可见</Radio>
            </Radio.Group>
          </Form.Item>
          
          {permissionType === 2 && (
            <Form.Item label="选择可见用户">
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {userList.map(user => (
                  <div key={user.userId} style={{ marginBottom: 8 }}>
                    <Checkbox
                      checked={selectedUsers.includes(user.userId)}
                      onChange={e => {
                        const newSelectedUsers = e.target.checked 
                          ? [...selectedUsers, user.userId] 
                          : selectedUsers.filter(id => id !== user.userId);
                        setSelectedUsers(newSelectedUsers);
                      }}
                    >
                      {user.username}
                    </Checkbox>
                  </div>
                ))}
              </div>
            </Form.Item>
          )}
        </Form>
      </Modal>

      <Modal
        title="告警推送记录"
        visible={isAlertModalVisible}
        onCancel={() => handleAlertModalVisibility(false)}
        setIsModalVisible={handleAlertModalVisibility}
        footer={null} // 不显示默认的底部按钮
        width={800} // 设置 Modal 宽度
        // bodyStyle={{ backgroundColor: 'black', color: 'white' }} // 设置 Modal 背景色和文字颜色
        style={{ backgroundColor: 'black' }} // 设置 Modal 外部背景色
      >
        <Table dataSource={dataSource} columns={columns} pagination={false} />

        {/* 翻页组件 */}
        <Pagination
          style={{ marginTop: 16, textAlign: 'right' }}
          total={50} // 假设总共有50条数据
          pageSize={10} // 每页显示10条
          defaultCurrent={1} // 默认当前页
          onChange={(page, pageSize) => {
            console.log('当前页:', page, '每页条数:', pageSize);
            // 这里可以添加逻辑来更新表格数据
          }}
        />
      </Modal>
    </>
  );
}
