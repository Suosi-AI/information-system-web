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
import { useLocalStorageState } from 'ahooks';
import dayjs from 'dayjs';
import ReportList from 'src/components/common/ReportList';

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
import DataSmartSearchForm, { formatForm } from './DataSmartSearchForm';

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
import zhiku from './../../assets/images/icon/zhiku.svg';
const { RangePicker } = DatePicker;
const { Search, TextArea } = Input;
const plainOptions = [
  '微博',
  '公众号',
  '谷歌',
  '博客',
  '网站',
  '推特',
  '百度',
  '油管',
  '脸书',
  '电报',
  '智库',
];
/**
 * 内容类型
 */
const contentTypes = ['目标动向', '人员更替', '政策发布', '官方发布'];
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
    case '智库':
      return zhiku;

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

  const [firstLevelArchives, setFirstLevelArchives] = useLocalStorageState('firstLevelArchives', {
    defaultValue: [],
    listenStorageChange: true,
  });
  const [secondLevelArchives, setSecondLevelArchives] = useState({});
  const [selectedFirstLevelArchiveId, setSelectedFirstLevelArchiveId] = useState(null);
  const [selectedSecondLevelArchiveId, setSelectedSecondLevelArchiveId] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [isSocialEditorVisible, setIsSocialEditorVisible] = React.useState(false);
  const [mockData, setMockData] = useState([]);

  // import('./mock-data.js').then(({ data }) => {
  //   if (!mockData || mockData?.length === 0) {
  //     setMockData(data);
  //   }
  // });

  const [totalCount, setTotalCount] = useState(0);
  const [searchKeywords, setSearchKeywords] = useState('');
  const [modalData, setModalData] = useState({});
  const [newMonitor, setNewMonitor] = useState({ name: '', matchConditions: '' });
  // 媒体范围
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);

  const [isAllContentType, setIsAllContentType] = useState(true);

  const [targetMatchedCondition, setTargetMatchedCondition] = useState('');
  const [monitorName, setMonitorName] = useState('');
  const [isInitialFetch, setIsInitialFetch] = useState(true);
  const [shouldFetchData, setShouldFetchData] = useState(true);

  const [selectedIds, setSelectedIds] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [isAlert, setIsAlert] = useState(false);

  const [isPermissionModalVisible, setIsPermissionModalVisible] = useState(false);
  const [currentPermissionItem, setCurrentPermissionItem] = useState(null);
  const [permissionType, setPermissionType] = useState(1); // 1: 仅自己可见, 2: 指定用户可见
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userList, setUserList] = useState([]);

  // 内容类型
  const [contentType, setContentType] = useState('');
  // 搜索模式
  const [searchMode, setSearchMode] = useState('fuzzy');
  const [filterRule, setFilterRule] = useState('');
  const [queryListObj, setQueryListObj] = useState();

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

  const handleSearch = (input = '', manualFetch) => {
    let searchQuery = input;
    if (typeof input === 'object' && 'target' in input) {
      const { target } = searchQuery;
      searchQuery = target.value;
    }
    setCurrentPage(1);
    setSearchQuery(searchQuery);
    setSearchKeywords(searchQuery);
    if (manualFetch) {
      fetchListData({ manualSearchContent: searchQuery });
      // setTimeout(() => fetchListData());
    } else {
      setShouldFetchData(true);
    }
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

  const onContentTypeChange = type => {
    setContentType(type);
  };

  useEffect(() => {
    fetchFirstLevelArchives();
  }, []);

  // 修改fetchListData的调用条件，仅当isInitialFetch为false时才调用
  useEffect(() => {
    if (shouldFetchData) {
      fetchListData();
      // setShouldFetchData(true);
    }
  }, [
    currentPage,
    selectedFirstLevelArchiveId,
    selectedRange,
    selectedLanguage,
    contentType,
    dateRange,
    // searchQuery,
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

        if (!firstLevelArchives || firstLevelArchives.length === 0) {
          setFirstLevelArchives((firstLevelData ?? []).map(formatForm));
        }
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
    function setQueryParams(query) {
      if (!query) {
        return;
      }

      const ifPresent = (value, action) => action?.(value);

      const { timeRange, dateRange, sourceType, lang, targetMatchedCondition, contentType } = query;
      setShouldFetchData(false);
      ifPresent(targetMatchedCondition, handleSearch);
      ifPresent(sourceType, arr => onChange(arr?.length === 0 ? [...plainOptions] : arr));
      ifPresent(lang, handleLanguageChange);
      ifPresent(timeRange, handleRangeChange);

      if (timeRange === 'custom') {
        ifPresent(dateRange, handleDateChange);
      }
    }
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
      setQueryParams(selectedArchive);
      // setTimeout(() => setShouldFetchData(true));
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
  const fetchListData = async (query = {}) => {
    const { manualSearchContent } = query;
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

      const searchInput = manualSearchContent ?? (searchQuery || '');

      const response = await getMonitorTargetNewsPage({
        // ...(queryListObj ?? {}),
        page: currentPage.toString(),
        limit: pageSize.toString(),
        startTime,
        endTime,
        lang: selectedLanguage || '',
        // targetMatchedCondition: targetMatchedCondition,
        // targetMatchedCondition: searchQuery,
        sourceType: checkedList.length === plainOptions.length ? '' : checkedList.join(','),
        contentType: contentType || '',
        ...{
          [searchMode === 'precise' ? 'searchContent' : 'targetMatchedCondition']: searchInput,
        },
      });
      setMockData(response.page.list);
      setTotalCount(response.page.totalCount);
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setIsLoading(false);
    }
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

  function smartSearchFormCloseCallback() {
    setIsSocialEditorVisible(false);
    setCurrentMonitor(null);
  }

  function onSaveSmartSearchForm(item) {
    const list = [...firstLevelArchives];

    const same = list.find(archive => archive.id === item.id);

    if (!same) {
      setFirstLevelArchives([...list, item]);
      message.success('添加成功');
    } else {
      setFirstLevelArchives(list.map(i => (i.id === item.id ? item : i)));
      message.success('编辑成功');
    }

    smartSearchFormCloseCallback();
  }

  function removeSmartSearchForm(id) {
    const list = [...firstLevelArchives];
    setFirstLevelArchives(list.filter(item => item.id !== id));
    message.success('删除成功');
  }

  const handleCancel = () => {
    console.log('取消操作');
    smartSearchFormCloseCallback();
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
  };
  const dataSource = [
    {
      key: 1,
      time: '2025-01-01 10:00:00',
      content: '阿布扎比在 MIPCOM 2024 上推出新现金返还，最低 35%++',
      source: '台湾英文新闻',
    },
    {
      key: 2,
      time: '2024-12-31 10:00:00',
      content: '成龙房祖名一家三代亮相JCE群星宴(6)',
      source: '台湾英文新闻',
    },
    {
      key: 3,
      time: '2024-12-30 20:10:00',
      content: '《沉睡在大海的钻石》是一部历史杰作，华丽的演员阵容向国村淳表示感谢“在日剧中……”',
      source: '谷歌',
    },
    {
      key: 4,
      time: '2024-12-29 10:00:60',
      content: '消息：美拟把向华为供管制晶片的中国公司列黑名单',
      source: '联合早报',
    },
    {
      key: 5,
      time: '2024-12-29 02:00:00',
      content: '据报助华为获台积电晶片 算能科技被美列入黑名单',
      source: '日本每日新闻',
    },
    {
      key: 6,
      time: '2024-12-28 10:00:60',
      content: '日经亚洲编辑的来信：日产本田合并谈判和一个时代的结束',
      source: '日经亚洲',
    },
    {
      key: 7,
      time: '2024-12-26 12:20:00',
      content: '联华电子表示没有在美国建厂的计划',
      source: '台北时报',
    },
  ];

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
  return (
    <>
      <div className={styles.container}>
        <div className={styles.left}>
          <Button onClick={handleAddMonitor} icon={<PlusOutlined />} className={styles.btn}>
            数据智能搜索
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
                      onConfirm={event => removeSmartSearchForm(item.id, event)}
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

        <DataSmartSearchForm
          data={currentMonitor}
          visible={isSocialEditorVisible}
          onOk={onSaveSmartSearchForm}
          onCancel={handleCancel}
        />
        <div className={styles.container1}>
          <div className={styles.countTop}>
            <div
              className={styles.searchTop}
              style={{
                display: 'grid',
                gridTemplateColumns: 'min-content 600px 100px',
                gap: '10px',
              }}
            >
              <Select
                value={
                  ['日本+海上保安厅', '美国+海岸警卫队', '台湾+海巡署'].includes(searchQuery)
                    ? searchQuery
                    : null
                }
                onChange={value => handleSearch(value, true)}
                placeholder="请选择过滤规则"
              >
                {['日本+海上保安厅', '美国+海岸警卫队', '台湾+海巡署'].map(rule => {
                  return (
                    <Select.Option key={rule} value={rule}>
                      {rule || '数据筛选规则'}
                    </Select.Option>
                  );
                })}
              </Select>
              <Search
                placeholder="请输入您要搜索的内容"
                allowClear
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onSearch={e => handleSearch(e, true)}
              />
              <Select value={searchMode} onChange={value => setSearchMode(value)}>
                <Select.Option value="precise">精准搜索</Select.Option>
                <Select.Option value="fuzzy">模糊搜索</Select.Option>
              </Select>
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
                  defaultValue={(dateRange || ['00:00:00', '23:59:59']).map(v => dayjs(v))}
                  className="mar-l-10"
                  onChange={handleDateChange}
                />
              )}
            </div>
            <div className={styles.mediaSelect}>
              <span>网站类型：</span>
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
              <span className={styles.curP}>地区：</span>
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
                中国
              </span>
              {/* <span
              className={`${styles.curP1} ${selectedLanguage === '繁体' ? styles.selected : ''}`}
              onClick={() => handleLanguageChange('繁体')}
            >
              繁体
            </span> */}
              <span
                className={`${styles.curP1} ${selectedLanguage === '日语' ? styles.selected : ''}`}
                onClick={() => handleLanguageChange('日语')}
              >
                日本
              </span>
              <span
                className={`${styles.curP1} ${selectedLanguage === '英语' ? styles.selected : ''}`}
                onClick={() => handleLanguageChange('英语')}
              >
                美国
              </span>
              {/* <span
              className={`${styles.curP1} ${selectedLanguage === '韩语' ? styles.selected : ''}`}
              onClick={() => handleLanguageChange('韩语')}
            >
              韩语
            </span> */}
              <span
                className={`${styles.curP1} ${selectedLanguage === '其他' ? styles.selected : ''}`}
                onClick={() => handleLanguageChange('其他')}
              >
                其他
              </span>
            </div>

            <div className={styles.contentTypeSelect}>
              <span className={styles.curP}>内容类型：</span>
              <span
                className={`${styles.curP1} ${contentType === '' ? styles.selected : ''}`}
                onClick={() => onContentTypeChange('')}
              >
                全部
              </span>
              {contentTypes.map(type => {
                return (
                  <span
                    key={type}
                    className={`${styles.curP1} ${contentType === type ? styles.selected : ''}`}
                    onClick={() => onContentTypeChange(type)}
                  >
                    {type}
                  </span>
                );
              })}
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
            </div>
          </div>
          <ReportList
            list={mockData}
            queryOption={{ keyword: searchKeywords }}
            loading={isLoading}
            pagination={
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
            }
            onFlush={fetchListData}
          />
        </div>
      </div>

      <Modal
        title="权限配置"
        visible={isPermissionModalVisible}
        onOk={handlePermissionSave}
        onCancel={() => setIsPermissionModalVisible(false)}
        destroyOnClose
      >
        <Form layout="vertical">
          <Form.Item label="可见范围">
            <Radio.Group value={permissionType} onChange={e => setPermissionType(e.target.value)}>
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
