import React, { useState, useEffect, useCallback, useRef } from 'react';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import ReportList from 'src/components/common/ReportList';

import {
  PlusOutlined,
  YuqueOutlined,
  FolderOpenOutlined,
  FolderOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';

import styles from './index.less';
import { DatePicker, Pagination, Button, Input, Popconfirm, message, Select } from 'antd';
import SocialEditor from '@/components/common/SocialEditor';

const { RangePicker } = DatePicker;
const { Search } = Input;
import {
  getQcArchivesPage,
  getQcArchivesSourcePage,
  getNewsPage,
  getQcArchivesSave,
  getQcArchivesDelete,
  getQcArchivesUpdate,
  getQcArchivesById,
} from './../../services/store';
import { sourceTypeImg, calculateTimeRange } from '../../utils/common';

export default function Dashboard() {
  const isInitialMount = React.useRef(true);
  const [selectedRange, setSelectedRange] = useState('1m');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedContentType, setSelectedContentType] = useState('');
  const [dateRange, setDateRange] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentCardData, setCurrentCardData] = useState(null);

  const [firstLevelArchives, setFirstLevelArchives] = useState([]);
  const [secondLevelArchives, setSecondLevelArchives] = useState({});
  const [selectedFirstLevelArchiveId, setSelectedFirstLevelArchiveId] = useState(null);
  const [selectedSecondLevelArchiveId, setSelectedSecondLevelArchiveId] = useState(null);
  const [expanded, setExpanded] = useState(
    firstLevelArchives.reduce((acc, item) => ({ ...acc, [item.id]: false }), {})
  );

  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeList, setActiveList] = useState([]);

  const [isSocialEditorVisible, setIsSocialEditorVisible] = React.useState(false); //这个但是我没有销毁，没想过这一步。那你就先用if语句renturn
  const [mockData, setMockData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchKeywords, setSearchKeywords] = useState('');
  const [isLoading, setIsLoading] = useState({});

  const [searchMode, setSearchMode] = useState('precise'); // 'precise' 或 'fuzzy'

  const handleRangeChange = range => {
    setSelectedRange(range);

    if (range !== 'custom') {
      setDateRange(calculateTimeRange(range));
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

  const handleSearch = async search => {
    if (currentPage === 1) {
      await fetchListData();
      return;
    }
    setCurrentPage(1);
    setSearchQuery(search);
  };

  useEffect(() => {
    setCurrentPage(1);
    setMockData([]);
  }, [selectedFirstLevelArchiveId, selectedSecondLevelArchiveId]);

  useEffect(() => {
    fetchFirstLevelArchives();
  }, []);

  // 获取二级档案数据
  const fetchSecondLevelArchives = async archivesId => {
    try {
      const response = await getQcArchivesSourcePage({
        // page: currentPage.toString(),
        // limit: pageSize.toString(),
        archivesId,
      });
      if (response.code === 200) {
        const secondLevelData = response.data.map(item => ({
          id: item.sourceId,
          name: item.name,
          icon: 'MonitorOutlined',
        }));
        setSecondLevelArchives({
          ...secondLevelArchives,
          [archivesId]: secondLevelData,
        });
      }
    } catch (error) {
      console.error('获取二级档案数据失败:', error);
    }
  };
  useEffect(() => {
    const initialExpanded = firstLevelArchives.reduce(
      (acc, item) => ({ ...acc, [item.id]: false }),
      {}
    );
    setExpanded(initialExpanded);
  }, [firstLevelArchives]);

  const handleMonitorItemClick = id => {
    const newExpanded = { ...expanded };

    // 如果点击的是当前已展开的一级档案，则收起
    if (expanded[id]) {
      newExpanded[id] = false;
      setExpanded(newExpanded);
      setSelectedFirstLevelArchiveId(id);
      setSelectedSecondLevelArchiveId(null);
    } else {
      // 收起所有一级档案
      Object.keys(newExpanded).forEach(key => {
        newExpanded[key] = false;
      });

      // 展开当前点击的一级档案
      newExpanded[id] = true;

      setExpanded(newExpanded);

      // 如果展开状态为true，则设置选中的二级档案ID为空，并获取二级档案数据
      if (newExpanded[id]) {
        setSelectedFirstLevelArchiveId(id);
        setSelectedSecondLevelArchiveId('');
        fetchSecondLevelArchives(id);
      }
    }
  };

  const handleSecondLevelItemClick = (firstLevelId, secondLevelId) => {
    console.log('设置选中的二级档案ID:', secondLevelId);
    setSelectedFirstLevelArchiveId(firstLevelId);
    setSelectedSecondLevelArchiveId(secondLevelId);
    setCurrentPage(1);
  };

  // 新闻列表
  const fetchListData = async () => {
    setIsLoading(true);
    try {
      // let startTime, endTime;

      const [startTime, endTime] = dateRange.map(t => moment(t).format('YYYY-MM-DD HH:mm:ss'));

      // if (selectedRange === 'custom' && dateRange.length) {
      //   startTime = dateRange[0].format('YYYY-MM-DD HH:mm:ss');
      //   endTime = dateRange[1].format('YYYY-MM-DD HH:mm:ss');
      // } else if (selectedRange === 'all') {
      //   startTime = '';
      //   endTime = '';
      // } else {
      //   const { startTime: calculatedStartTime, endTime: calculatedEndTime } =
      //     calculateTimeRange(selectedRange);
      //   startTime = calculatedStartTime;
      //   endTime = calculatedEndTime;
      // }

      const response = await getNewsPage({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        archivesId: selectedFirstLevelArchiveId,
        sourceId: selectedSecondLevelArchiveId || '',
        ...(selectedRange !== 'all' && {}),
        lang: selectedLanguage || '',
        ...(searchQuery && {
          [searchMode === 'precise' ? 'searchContent' : 'targetMatchedCondition']: searchQuery,
        }),
        area: selectedArea || '',
        contentType: selectedContentType || '',
        startTime,
        endTime,
      });
      setMockData(response.page.list);
      setSearchKeywords(searchQuery);
      setTotalCount(response.page.totalCount);
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (selectedRange === 'custom' && dateRange?.length === 0) {
        return;
      }
      fetchListData();
    }
    setMockData([]);
  }, [
    currentPage,
    selectedFirstLevelArchiveId,
    selectedSecondLevelArchiveId,
    selectedRange,
    selectedLanguage,
    dateRange,
    searchMode,
    // searchQuery,
    selectedArea,
    selectedContentType,
  ]);

  const handleSave = async (dataToSave, event) => {
    try {
      let response;

      if (isEditing) {
        setIsEditing(true);
        response = await getQcArchivesUpdate({ ...dataToSave, archivesId: editingId }); // 调用更新接口
        setEditingId(null); // 清除编辑id
        if (response && response.code === 200) {
          setActiveList(editingId); // 更新activeList为编辑的档案Id
        }
      } else {
        response = await getQcArchivesSave(dataToSave); // 调用新增接口
        // if (response && response.code === 200) {
        //   setActiveList(dataToSave.archivesId);
        // }
      }

      if (response && response.code === 200) {
        await fetchFirstLevelArchives(); // 刷新数据
        message.success(isEditing ? '编辑成功' : '保存成功');
        setIsSocialEditorVisible(false);
      } else {
        if (response && response.data && response.error) {
          message.error(response.error);
        } else if (response) {
          message.error(response.msg ? response.msg : '操作失败，未知错误');
        } else {
          message.error('操作失败，未收到响应');
        }
      }
    } catch (error) {
      console.error('操作失败:', error);
      message.error('操作时发生错误');
    }
  };

  // 创建一个 ref 来存储一级档案数据
  const firstLevelArchivesRef = useRef([]);

  // 获取一级档案数据
  const fetchFirstLevelArchives = async () => {
    try {
      const response = await getQcArchivesPage();
      if (response.code === 200) {
        const firstLevelData = response.data.map(item => ({
          id: item.archives_id,
          name: item.archives_name,
          children: [],
          archivesUserId: item.user_id,
        }));
        setFirstLevelArchives(firstLevelData); // 更新状态
        firstLevelArchivesRef.current = firstLevelData; // 更新 ref
        if (firstLevelData.length > 0) {
          setSelectedFirstLevelArchiveId(firstLevelData[0].id);
        }
      }
    } catch (error) {
      console.error('获取一级档案数据失败:', error);
    }
  };

  // 修改 handleEditClick 函数
  const handleEditClick = async (id, event) => {
    event.stopPropagation();
    try {
      // 使用 ref 中的数据来查找当前点击的档案对应的 archivesUserId
      const selectedArchive = firstLevelArchivesRef.current.find(archive => archive.id === id);

      if (!selectedArchive) {
        message.error('档案未找到');
        return;
      }

      const response = await getQcArchivesById({
        archivesId: id,
        archivesUserId: selectedArchive.archivesUserId,
      });
      if (response.code === 200 && response.data) {
        const targetKeys1 = response.data.resultList.map(item => item.sourceId);
        const selectedKeys1 = response.data.mapListList.map(item => item.id);

        setCurrentCardData({
          ...response.data,
          valueName: response.data.archives.archivesName || [],
          targetKeys: targetKeys1 || [],
          selectedKeys: selectedKeys1 || [],
        });
      }
      setIsEditing(true);
      setEditingId(id);
      setIsSocialEditorVisible(true);
    } catch (error) {
      console.error('获取档案详情失败:', error);
    }
  };

  const confirmDelete = async (id, event) => {
    event.stopPropagation(); // 阻止事件冒泡
    try {
      const response = await getQcArchivesDelete({ archivesId: id });

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
    setIsEditing(false); // 设置为新增状态
    setCurrentCardData({}); // 清空数据
    setIsSocialEditorVisible(true); // 显示编辑器
  };

  const handleCancel = () => {
    console.log('取消操作');
    setIsSocialEditorVisible(false);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.left}>
          <Button onClick={handleAddMonitor} icon={<PlusOutlined />} className={styles.btn}>
            添加信源档案
          </Button>
          <div className={styles.leftB}>
            {firstLevelArchives.map(item => (
              <div key={item.id}>
                <div className={styles.listItem} onClick={() => handleMonitorItemClick(item.id)}>
                  {expanded[item.id] ? <FolderOpenOutlined /> : <FolderOutlined />}
                  <span className={styles.title}>{item.name}</span>
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
                {expanded[item.id] && (
                  <div className={styles.itemStyle}>
                    {secondLevelArchives[item.id] &&
                      secondLevelArchives[item.id].map(child => (
                        <div
                          key={child.id}
                          style={{
                            background:
                              selectedSecondLevelArchiveId === child.id
                                ? 'rgba(2, 243, 221, 0.1)'
                                : '',
                            color: selectedSecondLevelArchiveId === child.id ? 'white' : '',
                            lineHeight: '50px',
                            paddingLeft: '16px',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleSecondLevelItemClick(item.id, child.id)}
                        >
                          <YuqueOutlined style={{ marginRight: '4px' }} />
                          <span className={styles.title}>{child.name}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {isSocialEditorVisible ? (
          <SocialEditor
            visible={isSocialEditorVisible}
            onSave={handleSave}
            isEditing={isEditing}
            data={currentCardData}
            onCancel={handleCancel}
            editingId={editingId}
          />
        ) : null}

        <div className={styles.container1}>
          <div className={styles.countTop} style={{ paddingBottom: '0' }}>
            <div className={styles.searchTop}>
              <Search
                value={searchQuery}
                placeholder="请输入您要搜索的内容"
                allowClear
                onSearch={e => handleSearch(e)}
                onChange={e => setSearchQuery(e.target.value)}
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
                  // ...selectStyle,
                }}
                type="primary"
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
                className={`${styles.curP1} ${selectedLanguage === '英语' ? styles.selected : ''}`}
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
                className={`${styles.curP1} ${selectedArea === '马来西亚' ? styles.selected : ''}`}
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
                className={`${styles.curP1} ${selectedArea === '官方发布' ? styles.selected : ''}`}
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
                }}
                onShowSizeChange={(current, size) => {
                  setCurrentPage(1);
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
    </>
  );
}
