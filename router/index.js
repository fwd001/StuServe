var router = require('express').Router()
var db = require('../db')
var { resSuc, resErr } = require('../tool')
const routeName = '/api'

const regPos = /^\d+(\.\d+)?$/ //非负浮点数

// 注册
router.post(`${routeName}/register`, function(req, res) {
	var payload = req.body
	if (!payload.username) return res.send(resErr('账号为必填项'))
	if (!payload.password) return res.send(resErr('密码为必填项'))
	db.queryUser(payload, u => {
		if (u) return res.send(resErr('账号已存在'))
		if (payload.password.length < 6)
			return res.send(resErr('密码最小为6位'))
		db.register(payload, () => {
			res.send(resSuc('注册成功'))
		})
	})
})
// 登录
router.post(`${routeName}/login`, function(req, res) {
    var payload = req.body
	if (!payload.username) return res.send(resErr('账号为必填项'))
	if (!payload.password) return res.send(resErr('密码为必填项'))
	db.login(payload, u => {
		if (u) return res.send(resSuc('登录成功'))
		res.send(resErr('账号或密码错误'))
	})
})

// 新增
router.post(`${routeName}/add`, function(req, res) {
	var payload = req.body
	if (!payload.id) return res.send(resErr('学号为必填项'))
	if (!payload.name) return res.send(resErr('姓名为必填项'))
	if (!payload.chinese) return res.send(resErr('语文成绩为必填项'))
	if (!payload.english) return res.send(resErr('英语成绩为必填项'))
	if (!payload.mathematics) return res.send(resErr('数学成绩为必填项'))
	if (!regPos.test(payload.id + '')) return res.send(resErr('学号只能为数字'))
	if (!payload.age) payload.age = 0
	db.queryStu(payload, u => {
		if (u) return res.send(resErr('学号已存在'))
		db.add(payload, () => res.send(resSuc('新增成功')))
	})
})

// 查询
router.get(`${routeName}/getList`, function(req, res) {
	var payload = JSON.parse(req.query.body)
	if (!payload.page) return res.send(resErr('page为必填项'))
	if (!payload.pageSize) return res.send(resErr('pageSize为必填项'))
	const page = payload.page - 1
	const pageSize = payload.pageSize - 1
	db.get(payload, u => {
		const { id = '', name = '', age = '', english = '' } = payload
		const arr = u.filter(
			v =>
				v.id.includes(id) &&
				v.name.includes(name) &&
				(v.age === age || !age) &&
				v.english.includes(english)
		)
		const _list = arr.slice(page * (pageSize + 1), (page + 1) * (pageSize + 1))
		console.log(page * (pageSize + 1), pageSize + 1)
		const data = {
			total: arr.length,
			page: payload.page,
			pageSize: payload.pageSize,
			list: _list
		}
		res.send(resSuc('获取成功', data))
		// db.add(payload, () => res.send(resSuc('新增成功')))
	})
})

// 删除
router.get(`${routeName}/del`, function (req, res) {
	var payload = JSON.parse(req.query.body)
	if (!payload._id) return res.send(resErr('_id为必填项'))
	db.del(payload, () => {
		res.send(resSuc('删除成功'))
	})
})

// 编辑更新
router.post(`${routeName}/edit`, function (req, res) {
	var payload = req.body
	console.log(payload);
	if (!payload._id) return res.send(resErr('_id为必填项'))
	if (!payload.name) return res.send(resErr('姓名为必填项'))
	if (!payload.chinese) return res.send(resErr('语文成绩为必填项'))
	if (!payload.english) return res.send(resErr('英语成绩为必填项'))
	if (!payload.mathematics) return res.send(resErr('数学成绩为必填项'))
	if (!payload.age) payload.age = 0
	db.edit(payload, () => {
		res.send(resSuc('编辑成功'))
	})
})

module.exports = router
