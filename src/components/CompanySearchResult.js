import { List, Button, Avatar, message } from 'antd';
import React from 'react';
import $ from 'jquery';
import {API_ROOT, COLOR_LIST, TOKEN_KEY} from '../constants';

export class CompanySearchResult extends React.Component {
    handleAddFriend = (e) => {
        let receiver = e.target.id;
        console.log(e.target.id);
        $.ajax({
            url: `${API_ROOT}/student/sendFriend.php`,
            method: 'POST',
            data: {
                cname: this.props.username,
                send: this.props.username,
                receive: receiver,
                token: localStorage.getItem(TOKEN_KEY),
            },
        }).then((response) => {
            let res = JSON.parse(response);
            console.log(response.length);
            if (response.length === 38) {
                message.warning(`${receiver} has not accepted your request yet.`);
            }
            if (response.length === 36) {
                message.success(`${receiver} has received your request.`);
            }
            if (response.length === 26) {
                message.warning("You guys are already friends.");
            }
            console.log(res);
        }, (error) => {
            console.log(error);
        })
    }

    render() {
        const avatar = (item) => (
            <Avatar
                style={{
                    backgroundColor: COLOR_LIST[Math.floor(Math.random() * 4)],
                    verticalAlign: 'middle',
                    lineHeight: '50'
                }}
                size="large"
            >
                {item.sfirstname}
            </Avatar>
        );

        const title = (item) => (
            <a href="https://www.linkedin.com/in/shuaizhang621">
                {item.sfirstname} {item.slastname} {item.semail == this.props.username && " <-- You"}
            </a>
        );

        const description = (item) => (
            <span>
                <span>{`${item.suniversity}  |   ${item.smajor}`}</span>
                <Button
                    className="add-friend-button"
                    id={item.semail}
                    shape="circle"
                    icon="user-add"
                    size="large"
                    onClick={this.handleAddFriend}
                    disabled={item.semail == this.props.username}
                />
            </span>
        );

        return (
            <div className="result-people">
                <List
                    className="item-container"
                    grid={{ column: 2, gutter: 20, }}
                    size="large"
                    dataSource={this.props.result}
                    renderItem={item => (
                        <List.Item
                            key={item.semail}
                        >
                            <List.Item.Meta
                                avatar={avatar(item)}
                                title={title(item)}
                                description={description(item)}
                            />
                        </List.Item>
                    )}
                />
            </div>

        );
    }
}