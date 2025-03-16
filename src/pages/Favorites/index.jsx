import React, { useState, useEffect } from 'react';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import Icon from '@/components/Icon';
import moment from 'moment';
import * as ReadReportPlatform from './readReportPlatform';
import {
  PlusOutlined,
  DownloadOutlined,
  LeftOutlined,
  RightOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  UndoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  DeleteOutlined,
  EditOutlined,
  AimOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';

import styles from './index.less';
import {
  Select,
  DatePicker,
  Checkbox,
  Pagination,
  Button,
  Divider,
  Menu,
  Modal,
  Card,
  Popconfirm,
  message,
  Input,
  Form,
  Tabs,
  Space,
  Table,
  Image,
  Tooltip,
  Radio,
  Dropdown,
  Empty,
  Upload,
  Typography,
} from 'antd';
const { RangePicker } = DatePicker;
const { Search, TextArea } = Input;
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
  getFavoritesList,
  getFavoritesSave,
  getFavoritesInfo,
  getFavoritesUpdate,
  getFavoritesDelete,
  queryPage,
  queryPageTable,
  createReport,
  deleteReport,
  exportReportToWord,
} from './../../services/store';
import MaterialReport from './MaterialReport';

import CardModal from './../../components/common/CardModal';

import SearchReportPlatform from './SearchReportPlatform';
import DashboardCard from './../../components/common/DashboardCard';
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
const BASE_IP = '/images';

const replaceIP = url => {
  const urlObj = new URL(url);
  return `${BASE_IP}${urlObj.pathname}`;
};

export default function Favorites() {
  const [row, setRow] = useState({ name: '' });
  const [current, setCurrent] = React.useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [targetMatchedCondition, setTargetMatchedCondition] = useState('');
  const [searchKeywords, setSearchKeywords] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentCardData, setCurrentCardData] = useState(null);

  const [selectedRange, setSelectedRange] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedContentType, setSelectedContentType] = useState('');
  const [dateRange, setDateRange] = useState([]);

  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [firstLevelArchives, setFirstLevelArchives] = useState([]);
  const [materialTemplate, setMaterialTemplate] = useState([]);
  const [selectedFirstLevelArchiveId, setSelectedFirstLevelArchiveId] = useState(null);
  const [selectedFirstLevel, setSelectedFirstLevel] = useState(true);
  const [newMonitor, setNewMonitor] = useState({ name: '', matchConditions: '' });
  const [currentMonitor, setCurrentMonitor] = useState({ folderName: '', folderId: null });
  const [isSocialEditorVisible, setIsSocialEditorVisible] = React.useState(false);

  const [isLeftPanelVisible, setIsLeftPanelVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [mockCardsData, setMockCardsData] = useState([]);

  const [selectedCard, setSelectedCard] = useState(null);
  const [textAreaValue, setTextAreaValue] = useState('');
  const [textRawAreaValue, setTextRawAreaValue] = useState('');
  const [summaryAreaValue, setSummaryAreaValue] = useState('');
  const [titleValue, setTitleValue] = useState('');
  const [titleRawValue, setTitleRawValue] = useState('');
  const [textAreaValue1, setTextAreaValue1] = useState('');
  const [danweiValue, setDanweiValue] = useState('');
  const [subjectValue, setSubjectValue] = useState('');
  const [imageList, setImageList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [shouldFetchData, setShouldFetchData] = useState(false);
  const [initialFetch, setInitialFetch] = useState(false);
  const [modalData, setModalData] = useState({});
  const [isActive, setIsActive] = useState(false);
  const [isActive2, setIsActive2] = useState(false);

  const [isCollected, setIsCollected] = useState(false);
  const [isExportMode, setIsExportMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  const [searchMode, setSearchMode] = useState('precise'); // 'precise' 或 'fuzzy'

  const calculateTimeRange = range => {
    const endDate = new Date(); // 结束时间为当前时间
    let startTime;

    switch (range) {
      case 'all':
        startTime = null;
        break;
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
      endTime: formatTime(endDate),
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

  const handleAreaChange = area => {
    setSelectedArea(area);
  };

  const handleContentTypeChange = area => {
    setSelectedContentType(area);
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 用于存储被选中的行的key值

  // 定义选择框的配置
  const rowSelection = {
    selectedRowKeys,
    onChange: newSelectedRowKeys => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const [columns, setColumns] = useState([
    {
      title: '序号',
      dataIndex: 'num',
      key: 'num',
      // width: 80,
      render: (text, record, index) => `${(currentPage - 1) * pageSize + index + 1}`,
    },
    {
      title: '报告名称',
      dataIndex: 'reportTitle',
      key: 'reportTitle',
      ellipsis: {
        showTitle: false,
      },
      render: reportTitle => (
        <Tooltip placement="topLeft" title={reportTitle}>
          {reportTitle}
        </Tooltip>
      ),
    },
    {
      title: '日期',
      dataIndex: 'createTime',
      key: 'createTime',
      // width: 200,
    },
    {
      title: '创建者',
      dataIndex: 'username',
      key: 'username',
      // width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: username => (
        <Tooltip placement="topLeft" title={username}>
          {username}
        </Tooltip>
      ),
    },

    {
      title: '操作',
      key: 'action',
      render: (_, reocrd) => (
        <Space size="middle" style={{ textAlign: 'center' }}>
          <a onClick={() => onExportFire(reocrd.reportId)}>下载</a>
          <a onClick={() => onDel(reocrd.reportId)}>删除</a>
          <a onClick={() => message.success('通报成功！')}>通报</a>
        </Space>
      ),
    },
  ]);
  const [dataSource, setDataSource] = useState([]);

  const onExportFire = async reportId => {
    exportReportToWord({ reportId: reportId })
      .then(resp => {
        // 创建 Blob 对象
        const blob = new Blob([resp], { type: 'application/vnd.ms-word;charset=utf-8' });

        // 生成 URL
        const url = window.URL.createObjectURL(blob);

        // 创建一个 <a> 元素并设置相关属性
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.download = '报告.doc'; // 设置下载文件的名称

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

  const onDel = async reportId => {
    try {
      const response = await deleteReport({ reportId: reportId });

      if (response.code === 200) {
        message.success('删除成功');
        handleTableReport();
      } else {
        message.error('删除失败');
      }
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除时发生错误');
    }
  };

  const handleSearch = searchQuery => {
    setCurrentPage(1);
    setSearchQuery(searchQuery);
    setSearchKeywords(searchQuery);
  };
  const handleTargetMatchedCondition = searchQuery => {
    setCurrentPage(1);
    setTargetMatchedCondition(searchQuery);
    setSearchKeywords(searchQuery);
  };
  const highLight = (text, keyword) => {
    // 增加空值检查
    if (!text) return '';

    if (!keyword || keyword.trim() === '') {
      return text;
    }
    const regex = new RegExp(`(${keyword})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => {
      if (regex.test(part)) {
        return (
          <span key={index} style={{ color: 'yellow' }}>
            {part}
          </span>
        );
      } else {
        return part;
      }
    });
  };

  useEffect(() => {
    fetchFirstLevelArchives();
  }, []);

  // 获取左侧文件夹id
  const fetchFirstLevelArchives = async () => {
    setIsLoading(true);
    try {
      const response = await getFavoritesList();
      if (response.code === 200) {
        const firstLevelData = response.data.map(item => ({
          id: item.folder_id,
          name: item.folder_name,
          // targetMatchedCondition: item.target_matched_condition,
        }));
        setFirstLevelArchives(firstLevelData);
        setShouldFetchData(true);
        if (firstLevelData.length > 0) {
          setSelectedFirstLevelArchiveId(firstLevelData[0].id);

          fetchListData(firstLevelData[0].id);
        }
      }
    } catch (error) {
      console.error('获取收藏文件夹数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = async (id, event) => {
    event.stopPropagation();
    try {
      const response = await getFavoritesInfo({ folderId: id });
      if (response.code === 200 && response.data) {
        setCurrentMonitor(response.data);
        setIsEditing(true);
        setEditingId(id);
        setIsSocialEditorVisible(true);
      } else {
        message.error('获取编辑详情失败');
      }
    } catch (error) {
      console.error('获取编辑详情失败:', error);
      message.error('获取编辑详情时发生错误');
    }
  };

  const handleSaveMonitor = async () => {
    try {
      let response;
      const saveData = {
        folderName: isEditing ? currentMonitor.folderName : newMonitor.name,
      };
      if (isEditing) {
        if (!currentMonitor.folderName) {
          alert('文件夹名称不能为空');
          return;
        }
        saveData.folderId = editingId;
        response = await getFavoritesUpdate(saveData);
      } else {
        if (!newMonitor.name) {
          alert('文件夹名称不能为空');
          return;
        }
        response = await getFavoritesSave(saveData);
      }
      if (response.code === 200) {
        message.success(isEditing ? '编辑文件夹成功' : '添加文件夹成功');
        setIsSocialEditorVisible(false);
        setShouldFetchData(true);
        await fetchFirstLevelArchives();
      } else {
        message.error(`${response.msg}`);
      }
    } catch (error) {
      console.error('操作失败:', error);
      message.error('操作时发生错误');
    }
  };

  const handleMonitorChange = e => {
    const { value } = e.target;
    if (isEditing) {
      setCurrentMonitor(prevMonitor => ({ ...prevMonitor, folderName: value }));
    } else {
      setNewMonitor(prevNewMonitor => ({ ...prevNewMonitor, name: value }));
    }
  };

  // 点击左侧文件夹
  const handleMonitorItemClick = id => {
    setSelectedIds([]); // 清空选中的ID
    setIsExportMode(false); // 关闭复选框显示

    const selectedArchive = firstLevelArchives.find(item => item.id === id);
    if (selectedArchive) {
      setSelectedFirstLevelArchiveId(selectedArchive.id);
      setCurrentPage(1); // 重置为第一页
      fetchListData(selectedArchive.id, searchQuery); // 传递folderId和searchContent
      setExpandedId(id);
    }
    setSelectedCard(null);
    setTextAreaValue(null);
    setTextRawAreaValue(null);
    setSummaryAreaValue(null);
    setTextAreaValue1(null);
    setSubjectValue(null);
    setTitleValue(null);
    setTitleRawValue(null);
    setDanweiValue(null);
    setImageList([]);
  };

  // useEffect(() => {
  //   if (selectedFirstLevelArchiveId) {
  //     fetchListData(selectedFirstLevelArchiveId, searchQuery, currentPage, pageSize);
  //   }
  // }, [selectedFirstLevelArchiveId, searchQuery, currentPage, pageSize]);

  // useEffect(() => {
  //   if (firstLevelArchives.length > 0 && searchQuery) {
  //     const firstFolderId = firstLevelArchives[0].id;
  //     setSelectedFirstLevelArchiveId(firstFolderId);
  //     fetchListData(firstFolderId, searchQuery);
  //     setExpandedId(firstFolderId);
  //   }
  // }, [firstLevelArchives, searchQuery]);

  // useEffect(() => {
  //   if (isActive) {
  //     handleTableReport();
  //   }
  // }, [currentPage, pageSize]);

  useEffect(() => {
    if (!selectedFirstLevel) {
      // 智能搜索时floderId为空
      fetchListData(null);
      return;
    }
    // 初始化时，如果firstLevelArchives有数据，设置第一个文件夹为选中状态，并获取数据
    if (firstLevelArchives.length > 0 && !selectedFirstLevelArchiveId) {
      const firstFolderId = firstLevelArchives[0].id;
      setSelectedFirstLevelArchiveId(firstFolderId);
      setExpandedId(firstFolderId);
      fetchListData(firstFolderId, '', 1, 10); // 注意：这里searchQuery为空字符串，因为你可能不想在初始化时就根据searchQuery过滤数据
    }

    // 当selectedFirstLevelArchiveId或searchQuery变化时，获取数据
    if (selectedFirstLevelArchiveId) {
      fetchListData(selectedFirstLevelArchiveId, searchQuery, currentPage, pageSize);
    }
  }, [
    firstLevelArchives,
    selectedFirstLevelArchiveId,
    selectedRange,
    selectedLanguage,
    selectedArea,
    selectedContentType,
    searchQuery,
    currentPage,
    pageSize,
    targetMatchedCondition,
  ]);

  // 监听isActive的变化，以决定是否调用handleTableReport
  useEffect(() => {
    if (isActive) {
      handleTableReport();
    }
  }, [isActive, currentPage, pageSize]);

  const fetchListData = async (folderId, searchContent) => {
    setIsLoading(true);
    try {
      let startTime, endTime;

      if (selectedRange === 'custom' && dateRange.length) {
        startTime = dateRange[0].format('YYYY-MM-DD HH:mm:ss');
        endTime = dateRange[1].format('YYYY-MM-DD HH:mm:ss');
      } else if (selectedRange === 'all') {
        startTime = '';
        endTime = '';
      } else {
        const { startTime: calculatedStartTime, endTime: calculatedEndTime } =
          calculateTimeRange(selectedRange);
        startTime = calculatedStartTime;
        endTime = calculatedEndTime;
      }

      const response = await queryPage({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        folderId: folderId,
        // searchContent: searchContent,
        ...(selectedRange !== 'all' && { startTime, endTime }),
        lang: selectedLanguage || '',
        ...(searchQuery && {
          [searchMode === 'precise' ? 'searchContent' : 'targetMatchedCondition']: searchQuery,
        }),
        targetMatchedCondition: targetMatchedCondition,
        area: selectedArea || '',
        contentType: selectedContentType || '',
      });
      setMockCardsData(response.page.list);
      setTotalCount(response.page.totalCount);
    } catch (error) {
      console.error('获取数据失败:', error);
      message.error(`获取数据失败${response.msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    setIsAllSelected(false);
  };
  const handleSelectAll = () => {
    const currentIds = mockCardsData.map(item => item.id);
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

  const handleTextAreaChange = event => {
    setTextAreaValue(event.target.value);
  };
  const handleSummaryAreaChange = event => {
    setSummaryAreaValue(event.target.value);
  };
  const handleTextRawAreaChange = event => {
    setTextRawAreaValue(event.target.value);
  };
  const handleTitleValueChange = event => {
    setTitleValue(event.target.value);
  };
  const handleTitleRawValueChange = event => {
    setTitleRawValue(event.target.value);
  };
  const confirmDelete = async (id, event) => {
    event.stopPropagation(); // 阻止事件冒泡
    try {
      const response = await getFavoritesDelete({ folderId: id });

      if (response.code === 200) {
        await fetchFirstLevelArchives();
        message.success('删除成功');
      } else {
        message.error('删除失败');
      }
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除时发生错误');
    }
  };

  const handleAddMonitor = () => {
    setIsEditing(false);
    setNewMonitor({ name: '' }); // 清空输入框状态
    setIsSocialEditorVisible(true);
  };

  const handleCancel = () => {
    setIsSocialEditorVisible(false);
  };

  const handleSelectCard = card => {
    setSelectedCard(null);
    setSelectedCard(card);
    setTextAreaValue(card.contentZh);
    setSubjectValue(card.subject);
    setSummaryAreaValue(card.summary);
    setTextRawAreaValue(card.contentRaw);
    setTitleValue(card.titleZh);
    setTitleRawValue(card.titleRaw);
    setImageList(card.pics);
    setCurrent(0);
  };

  const imagesArray = Array.isArray(imageList) ? imageList : imageList ? JSON.parse(imageList) : [];

  const imagesWithNewIP = imagesArray.map(src => replaceIP(src));

  const reset = () => {
    setSelectedCard(null);
    setTextAreaValue(null);
    setSummaryAreaValue(null);
    setTextRawAreaValue(null);
    setTextAreaValue1(null);
    setSubjectValue(null);
    setTitleValue(null);
    setTitleRawValue(null);
    setDanweiValue(null);
    setImageList([]);
    setCurrent(0);
  };

  const handleSave = async () => {
    const folderId = selectedFirstLevelArchiveId;
    const newsId = selectedCard ? selectedCard.id : null;
    const reportTitle = titleValue; // 标题
    const reportContent = textAreaValue; // 内容
    const reportImgs = imagesArray; // 图片列表
    const reportAnalyse = textAreaValue1; // 分析
    const reportIntelligenceUnit = danweiValue; // 情报单位

    const data = {
      folderId,
      newsId,
      reportTitle,
      reportContent,
      reportImgs,
      reportAnalyse,
      reportIntelligenceUnit,
    };

    try {
      const response = await createReport(data);
      if (response.code === 200) {
        // 处理成功的逻辑，比如关闭模态框，刷新列表等
        message.success(`${response.msg}`);
        setIsModalVisible(false);
        setSelectedCard(null);
        setTextAreaValue(null);
        setSubjectValue(null);
        setSummaryAreaValue(null);
        setTextRawAreaValue(null);
        setTextAreaValue1(null);
        setTitleValue(null);
        setTitleRawValue(null);
        setDanweiValue(null);
        setImageList([]);
        setCurrent(0);
      } else {
        message.error(`${response.msg}`);
      }
    } catch (error) {
      console.error('报告创建失败:', error);
    }
  };

  const handleModalVisibility = isVisible => {
    setIsModalVisible(isVisible);
  };

  const handleContentClick = async (id, showActions) => {
    // console.log(showActions, 'showActions');

    try {
      const response = await getInfo({ newsId: id });

      if (response.code === 200 && response.data) {
        setModalData(modalData => ({
          ...modalData,
          ...response.data,
          // showActions: showActions,
        }));
      } else {
        message.error(`获取数据失败${response.msg}`);
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
    const currentIds = mockCardsData.map(item => item.id);
    return currentIds;
  };

  // 手动选中新闻id
  const handleSelectChange = (id, checked) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  // 导出为Excel的方法
  const handleExportToExcel = () => {
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
      <Menu.Item key="wordZip" style={{ width: '150px' }} onClick={handleExportToWordZip}>
        导出为WordZip
      </Menu.Item>
    </Menu>
  );

  const [tabName, setTabName] = useState('');
  useEffect(() => {
    if (tabName === 'readReportPlatform') {
      import('./readReportPlatform/mock-data').then(({ data }) => {
        setMockCardsData(data);
      });
    } else {
      import('../Social/mock-data').then(({ reports }) => {
        setMockCardsData(reports);
      });
    }
  }, [tabName]);

  function handleTypeChange(value) {
    if (!value) {
      return;
    }
    import('./readReportPlatform/mock-data').then(({ data }) => {
      const filterData = data.filter(item => item.type === value);
      setMockCardsData(filterData);
    });
  }

  const handleTabClick = (event, tab) => {
    setTabName('');
    if (event === '1') {
      setIsActive(false);
      setCurrentPage(1);
      setIsLeftPanelVisible(true);
      // 如果firstLevelArchives有数据，选中第一个文件夹
      if (firstLevelArchives.length > 0) {
        const firstFolderId = firstLevelArchives[0].id;
        setSelectedFirstLevelArchiveId(firstFolderId);
        fetchListData(firstFolderId); // 传递folderId和searchContent
        setExpandedId(firstFolderId);
      }
    } else if (event === '2') {
      setIsActive(false);
      setTabName('readReportPlatform');
      setCurrentPage(1);
      setIsLeftPanelVisible(false);
      if (selectedFirstLevelArchiveId) {
        fetchListData(selectedFirstLevelArchiveId, searchQuery);
      }
    } else if (event === '3') {
      setIsActive(false);
      setCurrentPage(1);
      setIsLeftPanelVisible(true);
      handleTableReport();
    }
    // else if (event === '4') {
    //   setIsActive(false);
    //   setCurrentPage(1);
    //   setIsLeftPanelVisible(false);
    //   handleTableReport();
    // } else if (event === '4') {
    //   setIsActive(false);
    //   setCurrentPage(1);
    //   setIsLeftPanelVisible(false);
    //   handleTableReport();
    // }
  };
  const handleTableReport = async () => {
    setIsLoading(true);
    try {
      const response = await queryPageTable({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        // folderId: selectedFirstLevelArchiveId,
      });

      setDataSource(response.page.list);
      setTotalCount(response.page.totalCount);
    } catch (error) {
      console.error('获取数据失败:', error);
      message.error(`获取数据失败${response.msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviewImg = src => {
    setPreviewImage(src);
    setPreviewOpen(true);
  };

  const handleDeleteImg = src => {
    const index = imagesWithNewIP.findIndex(item => item === src);
    if (index !== -1) {
      const newImages = [...imagesArray];
      newImages.splice(index, 1);
      setImageList(newImages.map(src => src)); // 更新 imageList 状态
      // 如果 imageList 是字符串，需要转换回字符串
      const imageListStr = JSON.stringify(newImages);
      setImageList(imageListStr);
    } else {
      console.log('Image not found in the list');
    }
  };

  return (
    <>
      <div className={styles.container}>
        {isLeftPanelVisible && (
          <div className={styles.left}>
            <Button onClick={handleAddMonitor} icon={<PlusOutlined />} className={styles.btn}>
              新增文件夹
            </Button>
            <div>
              <div
                className={styles.searchItem}
                style={{
                  background: 'rgba(255, 128, 0, 0.5)',
                }}
                onClick={() => {
                  setSelectedFirstLevel(false);
                  fetchListData(null, searchQuery);
                }}
              >
                数据智能搜索
              </div>

              {firstLevelArchives.map(item => {
                return (
                  <div key={item.id}>
                    <div
                      className={styles.listItem}
                      style={{ background: expandedId === item.id ? '#118D86' : '' }}
                    >
                      <AimOutlined />
                      <span
                        className={styles.title}
                        onClick={() => handleMonitorItemClick(item.id)}
                      >
                        {item.name}
                      </span>
                      <React.Fragment>
                        <EditOutlined
                          className={styles.editIcon}
                          name="EditOutlined"
                          onClick={event => handleEditClick(item.id, event)}
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
                );
              })}
            </div>
          </div>
        )}
        {!isLeftPanelVisible && (
          <div className={styles.left} style={{ width: 'min-content' }}>
            {tabName === 'readReportPlatform' && (
              <ReadReportPlatform.Aside
                data={mockCardsData}
                searchQuery={searchQuery}
                selectedCard={selectedCard}
                handleSelectCard={handleSelectCard}
                handleContentClick={handleContentClick}
                handleSearch={handleSearch}
                onTypeChange={handleTypeChange}
                pagination={
                  <Pagination
                    current={currentPage}
                    total={totalCount}
                    pageSize={pageSize}
                    onChange={handlePageChange}
                    onShowSizeChange={handlePageChange}
                    style={{ margin: '10px auto', display: 'flex', justifyContent: 'center' }}
                    showSizeChanger={false}
                  />
                }
              />
            )}
          </div>
        )}

        <div className={styles.container1}>
          <Tabs defaultActiveKey="1" className={styles.tabBox} onTabClick={handleTabClick}>
            {/* <Tabs.TabPane tab="信息列表" key="1" className={styles.tabFirst}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0 20px',
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
                        <span style={{ color: 'red', margin: '0 5px' }}>{selectedIds.length}</span>
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
            {/* <Dropdown overlay={menu} placement="bottom" onClick={handleExportModeToggle}>
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

              {mockCardsData.length === 0 ? (
                <Empty style={{ margin: 'auto 8px', fontSize: '18px' }}></Empty>
              ) : (
                mockCardsData.map((card, index) => {
                  const processedCard = {
                    ...card,
                    titleZh: highLight(card.titleZh, searchQuery),
                    contentZh: highLight(card.contentZh, searchQuery),
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
                        newsId={card.id}
                        folderId={card.folderId}
                        whetherCollect={card.whetherCollect}
                        isCollected={isCollected}
                        setIsCollected={setIsCollected}
                        onHandle={fetchListData}
                      />
                    </div>
                  );
                })
              )}
              {mockCardsData.length > 0 && (
                <Pagination
                  current={currentPage}
                  total={totalCount}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                  onShowSizeChange={handlePageChange}
                  style={{ margin: '10px auto', display: 'flex', justifyContent: 'center' }}
                  showSizeChanger={false}
                />
              )} */}
            {/* </Tabs.TabPane> */}
            <Tabs.TabPane tab="报文素材" key="1" className={styles.tabFirst}>
              <div className={styles.searchTop}>
                <Search
                  placeholder="请输入您要搜索的内容"
                  allowClear
                  onSearch={e => handleSearch(e)}
                  style={{
                    width: 200,
                  }}
                />
                <Select
                  value={searchMode}
                  onChange={value => setSearchMode(value)}
                  style={{
                    width: 100,
                    marginLeft: 240,
                  }}
                >
                  <Select.Option value="precise">精准搜索</Select.Option>
                  <Select.Option value="fuzzy">模糊搜索</Select.Option>
                </Select>
              </div>

              <div className={styles.timeSelect}>
                <span className={styles.curP}>时间范围：</span>
                <span
                  className={`${styles.curP} ${selectedRange === 'all' ? styles.selected : ''}`}
                  onClick={() => handleRangeChange('all')}
                >
                  全部
                </span>
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
              <div className={styles.languageSelect}>
                <span className={styles.curP}>语种筛选：</span>
                <span
                  className={`${styles.curP1} ${selectedLanguage === '' ? styles.selected : ''}`}
                  onClick={() => handleLanguageChange('')}
                >
                  全部
                </span>
                <span
                  className={`${styles.curP1} ${
                    selectedLanguage === '中文' ? styles.selected : ''
                  }`}
                  onClick={() => handleLanguageChange('中文')}
                >
                  中文
                </span>
                <span
                  className={`${styles.curP1} ${
                    selectedLanguage === '繁体' ? styles.selected : ''
                  }`}
                  onClick={() => handleLanguageChange('繁体')}
                >
                  繁体
                </span>
                <span
                  className={`${styles.curP1} ${
                    selectedLanguage === '日语' ? styles.selected : ''
                  }`}
                  onClick={() => handleLanguageChange('日语')}
                >
                  日语
                </span>
                <span
                  className={`${styles.curP1} ${
                    selectedLanguage === '英语' ? styles.selected : ''
                  }`}
                  onClick={() => handleLanguageChange('英语')}
                >
                  英语
                </span>
                <span
                  className={`${styles.curP1} ${
                    selectedLanguage === '韩语' ? styles.selected : ''
                  }`}
                  onClick={() => handleLanguageChange('韩语')}
                >
                  韩语
                </span>
                <span
                  className={`${styles.curP1} ${
                    selectedLanguage === '其他' ? styles.selected : ''
                  }`}
                  onClick={() => handleLanguageChange('其他')}
                >
                  其他
                </span>
              </div>
              <div className={styles.areaSelect}>
                <span className={styles.curP}>信源地区：</span>
                <span
                  className={`${styles.curP1} ${selectedArea === '' ? styles.selected : ''}`}
                  onClick={() => handleAreaChange('')}
                >
                  全部
                </span>
                <span
                  className={`${styles.curP1} ${selectedArea === '中国' ? styles.selected : ''}`}
                  onClick={() => handleAreaChange('中国')}
                >
                  中国
                </span>
                <span
                  className={`${styles.curP1} ${selectedArea === '美国' ? styles.selected : ''}`}
                  onClick={() => handleAreaChange('美国')}
                >
                  美国
                </span>
                <span
                  className={`${styles.curP1} ${selectedArea === '日本' ? styles.selected : ''}`}
                  onClick={() => handleAreaChange('日本')}
                >
                  日本
                </span>
                <span
                  className={`${styles.curP1} ${selectedArea === '韩国' ? styles.selected : ''}`}
                  onClick={() => handleAreaChange('韩国')}
                >
                  韩国
                </span>
                <span
                  className={`${styles.curP1} ${selectedArea === '台湾' ? styles.selected : ''}`}
                  onClick={() => handleAreaChange('台湾')}
                >
                  台湾
                </span>
                <span
                  className={`${styles.curP1} ${selectedArea === '越南' ? styles.selected : ''}`}
                  onClick={() => handleAreaChange('越南')}
                >
                  越南
                </span>
                <span
                  className={`${styles.curP1} ${selectedArea === '菲律宾' ? styles.selected : ''}`}
                  onClick={() => handleAreaChange('菲律宾')}
                >
                  菲律宾
                </span>
                <span
                  className={`${styles.curP1} ${
                    selectedArea === '马来西亚' ? styles.selected : ''
                  }`}
                  onClick={() => handleAreaChange('马来西亚')}
                >
                  马来西亚
                </span>
              </div>

              <div className={styles.areaSelect}>
                <span className={styles.curP}>内容类型：</span>
                <span
                  className={`${styles.curP1} ${selectedContentType === '' ? styles.selected : ''}`}
                  onClick={() => handleContentTypeChange('')}
                >
                  全部
                </span>
                <span
                  className={`${styles.curP1} ${
                    selectedContentType === '目标动向' ? styles.selected : ''
                  }`}
                  onClick={() => handleContentTypeChange('目标动向')}
                >
                  目标动向
                </span>
                <span
                  className={`${styles.curP1} ${
                    selectedContentType === '人员更替' ? styles.selected : ''
                  }`}
                  onClick={() => handleContentTypeChange('人员更替')}
                >
                  人员更替
                </span>
                <span
                  className={`${styles.curP1} ${
                    selectedContentType === '政策发布' ? styles.selected : ''
                  }`}
                  onClick={() => handleContentTypeChange('政策发布')}
                >
                  政策发布
                </span>
                <span
                  className={`${styles.curP1} ${
                    selectedArea === '官方发布' ? styles.selected : ''
                  }`}
                  onClick={() => handleContentTypeChange('官方发布')}
                >
                  官方发布
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0 20px',
                }}
              >
                <div>
                  <span>
                    共<span style={{ color: '#FF8000', margin: '0 10px' }}>{totalCount}</span>
                    条记录
                  </span>
                </div>

                {/* 二次检索 */}
                <div className={styles.searchTop1}>
                  <Search
                    placeholder="请输入您要搜索的内容"
                    allowClear
                    onSearch={e => handleTargetMatchedCondition(e)}
                    style={{
                      width: 200,
                    }}
                  />
                </div>

                {totalCount > 0 ? (
                  <div>
                    {selectedIds.length > 0 && (
                      <span style={{ marginRight: 8 }}>
                        已选择
                        <span style={{ color: 'red', margin: '0 5px' }}>{selectedIds.length}</span>
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

              {mockCardsData.length === 0 ? (
                <Empty style={{ margin: 'auto 8px', fontSize: '18px' }} />
              ) : (
                mockCardsData.map((card, index) => {
                  const processedCard = {
                    ...card,
                    titleZh: highLight(card.titleZh, searchQuery),
                    contentZh: highLight(card.contentZh, searchQuery),
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
                        newsId={card.id}
                        folderId={card.folderId}
                        whetherCollect={card.whetherCollect}
                        isCollected={isCollected}
                        setIsCollected={setIsCollected}
                        onHandle={fetchListData}
                      />
                    </div>
                  );
                })
              )}
              {mockCardsData.length > 0 && (
                <Pagination
                  current={currentPage}
                  total={totalCount}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                  onShowSizeChange={handlePageChange}
                  style={{ margin: '10px auto', display: 'flex', justifyContent: 'center' }}
                  showSizeChanger={false}
                />
              )}
            </Tabs.TabPane>
            <Tabs.TabPane tab="阅报平台" key="2">
              <ReadReportPlatform.Body
                aside={
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr',
                      gridAutoRows: 'min-content',
                      rowGap: '16px',
                    }}
                  >
                    <div>
                      <Typography.Title level={5}>时间</Typography.Title>
                      <Input
                        placeholder=""
                        value={
                          subjectValue && subjectValue.length > 0 ? JSON.parse(subjectValue)[0] : ''
                        }
                        // className={styles.huoQing}
                        onChange={e => setDanweiValue(e.target.value)}
                        style={{ fontSize: '16px' }}
                      />
                    </div>

                    <div>
                      <Typography.Title level={5}>地点</Typography.Title>
                      <Input
                        placeholder=""
                        value={
                          subjectValue && subjectValue.length > 0 ? JSON.parse(subjectValue)[1] : ''
                        }
                        // className={styles.huoQing}
                        onChange={e => setDanweiValue(e.target.value)}
                        style={{ fontSize: '16px' }}
                      />
                    </div>

                    <div>
                      <Typography.Title level={5}>实体（人物）</Typography.Title>
                      <Input
                        placeholder=""
                        value={
                          subjectValue && subjectValue.length > 0 ? JSON.parse(subjectValue)[2] : ''
                        }
                        // className={styles.huoQing}
                        onChange={e => setDanweiValue(e.target.value)}
                        style={{ fontSize: '16px' }}
                      />
                    </div>

                    <div>
                      <Typography.Title level={5}>实体（机构）</Typography.Title>
                      <Input
                        placeholder=""
                        value={
                          subjectValue && subjectValue.length > 0 ? JSON.parse(subjectValue)[3] : ''
                        }
                        // className={styles.huoQing}
                        onChange={e => setDanweiValue(e.target.value)}
                        style={{ fontSize: '16px' }}
                      />
                    </div>

                    <div>
                      <Typography.Title level={5}>实体（装备）</Typography.Title>
                      <Input
                        placeholder=""
                        value={
                          subjectValue && subjectValue.length > 0 ? JSON.parse(subjectValue)[4] : ''
                        }
                        // className={styles.huoQing}
                        onChange={e => setDanweiValue(e.target.value)}
                        style={{ fontSize: '16px' }}
                      />
                    </div>

                    <div>
                      <Typography.Title level={5}>行动</Typography.Title>
                      <Input
                        placeholder=""
                        value={
                          subjectValue && subjectValue.length > 0 ? JSON.parse(subjectValue)[5] : ''
                        }
                        // className={styles.huoQing}
                        onChange={e => setDanweiValue(e.target.value)}
                        style={{ fontSize: '16px' }}
                      />
                    </div>

                    <div>
                      <Typography.Title level={5}>事件</Typography.Title>
                      <Input
                        placeholder=""
                        value={
                          subjectValue && subjectValue.length > 0 ? JSON.parse(subjectValue)[6] : ''
                        }
                        // className={styles.huoQing}
                        onChange={e => setDanweiValue(e.target.value)}
                        style={{ fontSize: '16px' }}
                      />
                    </div>
                  </div>
                }
                rawReportTitle={
                  <Input
                    className={styles.titleInput}
                    width={500}
                    value={titleRawValue}
                    onChange={handleTitleRawValueChange}
                    style={{ textAlign: 'center' }}
                  />
                }
                rawReportBody={
                  <TextArea
                    className={styles.textArea}
                    autoSize={{
                      minRows: 20,
                    }}
                    value={textRawAreaValue}
                    onChange={handleTextRawAreaChange}
                    style={{ marginRight: '10px', fontSize: '16px' }}
                  />
                }
                transformReportTitle={
                  <Input
                    className={styles.titleInput}
                    width={500}
                    value={titleValue}
                    onChange={handleTitleValueChange}
                    style={{ textAlign: 'center' }}
                  />
                }
                transformReportBody={
                  <TextArea
                    className={styles.textArea}
                    autoSize={{
                      minRows: 20,
                    }}
                    value={textAreaValue}
                    onChange={handleTextAreaChange}
                    style={{ marginLeft: '10px', fontSize: '16px' }}
                  />
                }
                summary={
                  <TextArea
                    className={styles.textArea}
                    autoSize={{
                      minRows: 20,
                    }}
                    value={summaryAreaValue}
                    onChange={handleSummaryAreaChange}
                    style={{ marginLeft: '10px', fontSize: '16px' }}
                  />
                }
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="素材通报" key="3">
              <MaterialReport
                left={{
                  header: (
                    <React.Fragment>
                      <Input
                        style={{ width: '200px' }}
                        width={500}
                        value={titleValue}
                        onChange={handleTitleValueChange}
                      />

                      <Select
                        value={materialTemplate}
                        style={{ marginLeft: '16px' }}
                        onSelect={setMaterialTemplate}
                        placeholder="请选择模板"
                      >
                        <Select.Option value="template1">模板1</Select.Option>
                        <Select.Option value="template2">模板2</Select.Option>
                        <Select.Option value="template3">模板3</Select.Option>
                      </Select>
                    </React.Fragment>
                  ),
                  main: (
                    <React.Fragment>
                      <div>
                        <p style={{ fontSize: '18px' }}>摘要</p>
                        <TextArea
                          className={styles.textArea}
                          autoSize={{
                            minRows: 20,
                          }}
                          value={summaryAreaValue}
                          onChange={handleTextAreaChange}
                        />
                      </div>
                      {!['template1', 'template3'].includes(materialTemplate) && (
                        <div>
                          <p style={{ fontSize: '18px' }}>图片</p>
                          <div
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              width: '100%',
                              minHeight: '400px',
                              maxHeight: '400px',
                              padding: '10px',
                              overflow: 'auto',
                              backgroundColor: '#fff',
                              borderRadius: '8px',
                            }}
                          >
                            {imagesWithNewIP.length > 0 &&
                              imagesWithNewIP.map((src, index) => (
                                <div
                                  key={index}
                                  style={{ display: 'flex', marginRight: '10px', height: '100px' }}
                                >
                                  <Image
                                    src={src}
                                    alt={`Image ${index}`}
                                    style={{ width: '100px', height: '100px', margin: '0 10px' }}
                                    onClick={() => handlePreviewImg(src)}
                                  />
                                  <CloseCircleOutlined
                                    onClick={() => handleDeleteImg(src)}
                                    style={{ color: 'black' }}
                                  />
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                      {!['template2', 'template3'].includes(materialTemplate) && (
                        <div>
                          <p style={{ fontSize: '18px' }}>分析</p>
                          <div>
                            <span style={{ width: '100px', fontSize: '16px' }}>分析认为：</span>
                            <TextArea
                              value={textAreaValue1}
                              onChange={e => setTextAreaValue1(e.target.value)}
                              autoSize={{
                                minRows: 5,
                              }}
                            />
                          </div>
                        </div>
                      )}
                      <div className={styles.huoQingBox}>
                        <Input
                          addonBefore="获情单位"
                          placeholder="*************科室"
                          value={danweiValue}
                          className={styles.huoQing}
                          onChange={e => setDanweiValue(e.target.value)}
                        />
                      </div>
                      <div style={{ justifySelf: 'center', display: 'flex', columnGap: '16px' }}>
                        <Button onClick={reset}>重置</Button>
                        <Button onClick={handleSave}> 生成报告</Button>
                      </div>
                    </React.Fragment>
                  ),
                }}
                right={
                  <div>
                    <Search placeholder="请输入关键字" allowClear onSearch={e => handleSearch(e)} />
                    <div style={{ display: 'flex', justifyContent: 'right', marginRight: '-60%' }}>
                      共<span style={{ color: 'red', margin: '0 8px' }}>{totalCount}</span>结果
                    </div>
                    <div className={styles.cardBox}>
                      {mockCardsData.length === 0 ? (
                        <Empty style={{ margin: '200px 8px', fontSize: '16px' }} />
                      ) : (
                        mockCardsData.map(card => {
                          const processedCard = {
                            ...card,
                            titleZh: highLight(card.titleZh, searchQuery),
                            contentZh: highLight(card.contentZh, searchQuery),
                          };

                          return (
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: 'min-content 1fr',
                                alignItems: 'center',
                              }}
                            >
                              <Radio
                                onChange={() => handleSelectCard(card)}
                                value={card.id}
                                checked={selectedCard && selectedCard.id === card.id}
                              />
                              <Card key={card.id} className={styles.card} style={{ margin: '0' }}>
                                <Card.Meta
                                  className={styles.cardMeta}
                                  title={
                                    <div
                                      onClick={() => handleContentClick(card.id, card.showActions)}
                                      style={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        maxWidth: '250px',
                                      }}
                                    >
                                      {processedCard.titleZh}
                                    </div>
                                  }
                                  description={
                                    <div
                                      style={{
                                        display: '-webkit-box',
                                        overflow: 'hidden',
                                        WebkitBoxOrient: 'vertical',
                                        WebkitLineClamp: '2',
                                        color: 'rgb(222, 218, 218)',
                                      }}
                                      className={styles.contentStyle}
                                      onClick={() => handleContentClick(card.id, card.showActions)}
                                    >
                                      {processedCard.contentZh}
                                    </div>
                                  }
                                />
                              </Card>
                            </div>
                          );
                        })
                      )}
                      {mockCardsData.length > 0 && (
                        <Pagination
                          current={currentPage}
                          total={totalCount}
                          pageSize={pageSize}
                          onChange={handlePageChange}
                          onShowSizeChange={handlePageChange}
                          style={{ margin: '10px auto', display: 'flex', justifyContent: 'center' }}
                          showSizeChanger={false}
                        />
                      )}
                    </div>
                  </div>
                }
              />
              {/* <div className={styles.centerStyle}>
                <div className={styles.centerLeft}>
                  {' '}
                  <div
                    style={{
                      height: '50px',
                      display: 'flex',
                      justifyContent: 'center',
                      width: '97%',
                    }}
                  >
                    <div>
                      <Input
                        className={styles.titleInput}
                        width={500}
                        value={titleValue}
                        onChange={handleTitleValueChange}
                      />

                      <Select
                        value={materialTemplate}
                        style={{ marginLeft: '16px' }}
                        onSelect={setMaterialTemplate}
                        placeholder="请选择模板"
                      >
                        <Select.Option value="template1">模板1</Select.Option>
                        <Select.Option value="template2">模板2</Select.Option>
                        <Select.Option value="template3">模板3</Select.Option>
                      </Select>
                    </div>
                  </div>
                  <p className={styles.textStyle}>摘要</p>
                  <TextArea
                    className={styles.textArea}
                    autoSize={{
                      minRows: 20,
                    }}
                    value={summaryAreaValue}
                    onChange={handleTextAreaChange}
                  />
                  {!['template1', 'template3'].includes(materialTemplate) && (
                    <React.Fragment>
                      <p className={styles.textStyle}>图片</p>
                      <div className={styles.imgBox}>
                        {imagesWithNewIP.length > 0 &&
                          imagesWithNewIP.map((src, index) => (
                            <div
                              key={index}
                              style={{ display: 'flex', marginRight: '10px', height: '100px' }}
                            >
                              <Image
                                src={src}
                                alt={`Image ${index}`}
                                style={{ width: '100px', height: '100px', margin: '0 10px' }}
                                onClick={() => handlePreviewImg(src)}
                              />
                              <CloseCircleOutlined
                                onClick={() => handleDeleteImg(src)}
                                style={{ color: 'black' }}
                              />
                            </div>
                          ))}
                      </div>
                    </React.Fragment>
                  )}
                  {!['template2', 'template3'].includes(materialTemplate) && (
                    <React.Fragment>
                      <p className={styles.textStyle}>分析</p>
                      <div className={styles.fenxiBox}>
                        <span style={{ width: '100px', fontSize: '16px' }}>分析认为：</span>
                        <TextArea
                          value={textAreaValue1}
                          onChange={e => setTextAreaValue1(e.target.value)}
                          autoSize={{
                            minRows: 5,
                          }}
                          className={styles.textAreaFenxi}
                        />
                      </div>
                    </React.Fragment>
                  )}
                  <div className={styles.huoQingBox}>
                    <Input
                      addonBefore="获情单位"
                      placeholder="*************科室"
                      value={danweiValue}
                      className={styles.huoQing}
                      onChange={e => setDanweiValue(e.target.value)}
                    />
                  </div>
                  <div className={styles.bottomBox}>
                    <Button className={styles.btn} onClick={reset}>
                      重置
                    </Button>
                    <Button onClick={handleSave}> 生成报告</Button>
                  </div>
                </div>
                <div className={styles.centerRight1} />
                <div className={styles.centerRight}>
                  <Search
                    placeholder="请输入关键字"
                    allowClear
                    onSearch={e => handleSearch(e)}
                    style={{
                      width: 200,
                    }}
                    className={styles.searchStyle}
                  />
                  <div style={{ display: 'flex', justifyContent: 'right', marginRight: '-60%' }}>
                    共<span style={{ color: 'red', margin: '0 8px' }}>{totalCount}</span>结果
                  </div>
                  <div className={styles.cardBox}>
                    {mockCardsData.length === 0 ? (
                      <Empty style={{ margin: '200px 8px', fontSize: '16px' }} />
                    ) : (
                      mockCardsData.map(card => {
                        const processedCard = {
                          ...card,
                          titleZh: highLight(card.titleZh, searchQuery),
                          contentZh: highLight(card.contentZh, searchQuery),
                        };

                        return (
                          <div className={styles.cardStyle} key={card.id}>
                            <Radio
                              onChange={() => handleSelectCard(card)}
                              value={card.id}
                              checked={selectedCard && selectedCard.id === card.id}
                            />
                            <Card key={card.id} className={styles.card}>
                              <Card.Meta
                                className={styles.cardMeta}
                                title={
                                  <div
                                    onClick={() => handleContentClick(card.id, card.showActions)}
                                    style={{
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      maxWidth: '250px',
                                    }}
                                  >
                                    {processedCard.titleZh}
                                  </div>
                                }
                                description={
                                  <div
                                    className={styles.contentStyle}
                                    onClick={() => handleContentClick(card.id, card.showActions)}
                                  >
                                    {processedCard.contentZh}
                                  </div>
                                }
                              />
                            </Card>
                          </div>
                        );
                      })
                    )}
                    {mockCardsData.length > 0 && (
                      <Pagination
                        current={currentPage}
                        total={totalCount}
                        pageSize={pageSize}
                        onChange={handlePageChange}
                        onShowSizeChange={handlePageChange}
                        style={{ margin: '10px auto', display: 'flex', justifyContent: 'center' }}
                        showSizeChanger={false}
                      />
                    )}
                  </div>
                </div>
              </div> */}
            </Tabs.TabPane>
            <Tabs.TabPane tab="报告管理" key="4">
              <Button
                onClick={() => message.success('批量通报成功！')}
                style={{
                  marginBottom: 16,
                  backgroundColor: 'rgba(255, 128, 0, 0.5)',
                  color: 'white',
                }} // 添加一些底部间距
              >
                批量通报
              </Button>
              <Table
                rowSelection={rowSelection} // 注入勾选框配置
                rowKey="reportId" // 为每行设置唯一的key
                columns={columns}
                dataSource={dataSource}
                pagination={{
                  position: ['bottomCenter'],
                  current: currentPage,
                  pageSize: pageSize,
                  total: totalCount,
                  onChange: handlePageChange,
                }}
              />

              {/* <Table
                  // key={`${index}+1`}
                  columns={columns}
                  dataSource={dataSource}
                  pagination={{
                    position: ['bottomCenter'],
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalCount,
                    onChange: handlePageChange,
                  }}
                /> */}
            </Tabs.TabPane>

            <Tabs.TabPane tab="搜报平台" key="5">
              <SearchReportPlatform />
            </Tabs.TabPane>
          </Tabs>
        </div>

        <Modal
          visible={isSocialEditorVisible}
          onOk={handleSaveMonitor}
          onCancel={handleCancel}
          data={currentCardData}
          isEditing={isEditing}
          className={styles.modalSty}
        >
          <Form labelWidth={120} labelPosition="left">
            <Form.Item label={isEditing ? '编辑文件夹名称：' : '文件夹名称'}>
              <Input
                placeholder="请输入文件夹名称"
                value={isEditing ? currentMonitor.folderName : newMonitor.name}
                onChange={handleMonitorChange}
              />
            </Form.Item>
          </Form>
        </Modal>

        <CardModal
          visible={isModalVisible}
          onCancel={() => handleModalVisibility(false)}
          modalData={modalData}
          setIsModalVisible={handleModalVisibility}
          handleExport={() => handleExport(modalData.id)}
          images={modalData.pics}
          isCollected={isCollected}
          setIsCollected={setIsCollected}
          onHandle={fetchListData}
        />
      </div>
    </>
  );
}
