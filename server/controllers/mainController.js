exports.homepage = async (req, res) => {
    const locals = {
      title: "لذه | الصفحة الرئيسية",
    }
    res.render('homePage', {
      locals,
      layout: '../views/layouts/front-page'
    });
  }
  