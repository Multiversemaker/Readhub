// controllers/admin/book/listController.js
const { Op } = require("sequelize");
const { buku: Book, kategori: Kategori, tipe: Tipe } = require("../../../models");
const { formatDate } = require("../../../utils/dateFormatter");
const { escapeRegExp } = require("../../../utils/escapeRegExp");

const DATE_FIELD = "tahun_terbit"; // Sesuaikan dg kolom tabel

exports.getAllBooksadmin = async (req, res) => {
  try {
    const { startDate, endDate, judul: rawJudul, page = 1 } = req.query;

    let where = {};

    // Filter Date
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && end) {
      end.setHours(23, 59, 59, 999);
      where[DATE_FIELD] = { [Op.between]: [start, end] };
    } else if (start) {
      where[DATE_FIELD] = { [Op.gte]: start };
    } else if (end) {
      where[DATE_FIELD] = { [Op.lte]: end };
    }

    // Filter Judul
    const judul = rawJudul?.trim() || "";
    if (judul && judul !== "semua") {
      where.judul = { [Op.regexp]: escapeRegExp(judul) };
    }

    // Pagination
    const itemsPerPage = 6;
    const offset = (page - 1) * itemsPerPage;

    const totalItems = await Book.count({ where });
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    const books = await Book.findAll({
      where,
      include: [
        { model: Kategori, as: "kategori" },
        { model: Tipe, as: "tipe" }
      ],
      order: DATE_FIELD ? [[DATE_FIELD, "DESC"]] : [["id_buku", "DESC"]],
      limit: itemsPerPage,
      offset
    });

    const booksPerPage = books.map((b) => {
      const json = b.toJSON();
      if (json[DATE_FIELD]) json[DATE_FIELD] = formatDate(json[DATE_FIELD]);
      return json;
    });

    res.render("admin/pages/catalog", {
      layout: "admin/layouts/catalog/book-layout",
      title: "Books",
      books: booksPerPage,
      currentPage: page,
      totalPages,
      startDate,
      endDate,
      selectedJudul: judul,
      noBooksFound: (startDate || endDate) && booksPerPage.length === 0
    });

  } catch (err) {
    console.error("Error getAllBooksadmin:", err);
    res.status(500).send("Error fetching books");
  }
};