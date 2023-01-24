//@ts-nocheck
import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button as AntButton, Input, Space, Modal, Table } from 'antd';
import Highlighter from 'react-highlight-words';

const onChange = (pagination, filters, sorter, extra) => {};

const TableWithFilter = ({ columns, data, setDrawer, handleOnEdit }) => {
  const [searchText, setSearchText] = React.useState('');
  const [searchedColumn, setSearchedColumn] = React.useState('');
  const searchInput = React.useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const uniqueList = () => {
    let uniqueList = [];
    // for (let i = 0; i < list.length; i++) {
    //   if (
    //     !uniqueList.includes({
    //       text: list[i].TranPrtName,
    //       value: list[i].TranNo,
    //     })
    //   ) {
    //     uniqueList.push({
    //       text: list[i].TranPrtName,
    //       value: list[i].TranNo,
    //     });
    //   }
    // }
    const displayList = list.map((item) => item.TranPrtName);
    for (let i = 0; i < displayList.length; i++) {
      if (!uniqueList.includes(displayList[i])) {
        uniqueList.push(displayList[i]);
      }
    }

    uniqueList = uniqueList.map((item) => {
      return {
        text: item,
        value: item,
      };
    });
    return uniqueList;
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        id="popup"
        style={{
          padding: 8,
          zIndex: 10000,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <AntButton
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </AntButton>
          <AntButton
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </AntButton>
          <AntButton
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </AntButton>
          <AntButton
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </AntButton>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  let modifiedColumns = columns.map((item) => {
    if (item.search) {
      return { ...item, ...getColumnSearchProps(item.dataIndex) };
    }
    return item;
  });
  // append button to modifiedColumns
  // modifiedColumns.push({
  //   title: '',
  //   dataIndex: '',
  //   key: 'x',
  //   render: (e) => (
  //     <button
  //       onClick={() => {
  //         handleOnEdit(e.key);
  //         setDrawer(false);
  //       }}
  //       className="mb-4 px-10 bg-primary text-white h-8 rounded-md ml-4"
  //     >
  //       Show
  //     </button>
  //   ),
  // });

  return (
    <div className="">
      <Table columns={modifiedColumns} dataSource={data} onChange={onChange} />
    </div>
  );
};

export default TableWithFilter;
