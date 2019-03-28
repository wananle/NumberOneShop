$("footer").load("public.html .ft-wrap", function(){
    showcookie.init();
})
$(".sale-prod").load("swiper.html .sale-prod-cont", function(){
    cartSwiper.init(".sale-prod-cont");
})

var Cart = (function(){
    let $el, $noneDataBox, $showDatabox, $checked, $setCulBox,$listbox,$checkedbox=0,
    $check_all,$showBox,$showLi,shopData,count = 0;
    return {
        init(ele){
            $el = $(ele);
            // 获取没有数据展示的内容的盒子
            $noneDataBox = $el.find(".empty");
            // 获取展示数据的盒子
            $showDatabox = $el.find(".cart-wrap");
            // 设置数据的盒子
            $showBox =  $showDatabox.find(".cart-item");
            // 获取结算的盒子
            $setCulBox = $el.find(".settling-column-bar");
            this.getData();
            // 获取所有的li
            $showLi = $showBox.find(".item");
            //商品选择按钮集合
            $listbox = $('.check-item');
            //商品全选按钮集合
            $check_all = $('.check-all');
            this.event();
            // this.showDiv();
            this.setCountPrice();
        },
        event(){
            const _this = this;
            $showBox.on("click",".del-btn",function(){
                var self = $(this)
                var index = self.index('.del-btn');
                count = count - shopData[index].jp;
                shopData.splice(index, 1);
                _this.setCountPrice();
                _this.setShopData(shopData);
                _this.setCarData();
            })
            
            for(let i = 0; i < $showLi.length; i++){
                let n = 1,
                $price = $($showLi[i]).find(".item-a-money"),
                price = shopData[i].jp - 0;
                $($(".minus")[i]).click(function(){
                    const inp = $(this).siblings("#num");
                    if(n <= 1){
                        n = 1;
                        $(this).addClass("unable");
                    } else {
                        n--
                        $(this).removeClass("unable");
                        count = count - price;
                    }
                    inp.val(n);
                    $price.text(price * n)
                    _this.setCountPrice();
                })
                $($(".add")[i]).click(function(){
                    const inp = $(this).siblings("#num");
                    n++
                    $(".minus").removeClass("unable");
                    inp.val(n);
                    $price.text(price * n)
                    count = count + price
                    _this.setCountPrice();
                })
                shopData[i].num = n;
                _this.setCarData();
            }
           
            //上面的全选按钮点击时
            $($check_all[0]).click(function(){
                $(this).toggleClass('checked');           
                // 返回this的class数量
                var str = $($check_all[0]).attr('class');
                let arr = str.split(' ');
                //如果为3 那就全选
                if(arr.length === 3){
                    $('.pay-checkbox').addClass('checked');
                    $listbox.addClass('checked');
                    $checkedbox = 0;
                 
                }else{
                    //否则全不选
                    $('.pay-checkbox').removeClass('checked');
                    $listbox.removeClass('checked');
                    $checkedbox = 0;
                }
            })
            //每个商品选择按钮
            console.log($(".item"))
            $(".item").on("click", ".check-item", function(){
                //当前点击的切换 添加删除 checked
                $(this).toggleClass('checked');         
                //获取拥有checked的 itme数量;       
                for(var i = 0; i < $listbox.length;i++){
                  let str = $($listbox[i]).attr('class');
                  let arr = str.split(' ');
                  if(arr.length === 3){
                      $checkedbox += 1;
                  }
                }
                //如果每个itme都有checked   那就勾上全选
                if($checkedbox === $listbox.length){
                    $check_all.addClass('checked')
                    $checkedbox = 0;
                }else{
                    //否则不选
                    $check_all.removeClass('checked')
                    $checkedbox = 0;
                }
            })
            $($check_all[1]).click(function(){
                $(this).toggleClass('checked');
                var str = $($check_all[1]).attr('class');
                let arr = str.split(' ');
                //自带3个class 存在checked就为4个所以全选
                if(arr.length === 4){
                    $check_all.addClass('checked');
                    $listbox.addClass('checked');
                    $checkedbox = 0;
                }else{
                //否者全不选
                    $check_all.removeClass('checked');
                    $listbox.removeClass('checked');
                    $checkedbox = 0;
                }
            })
        },
        setCountPrice(){
            $(".amount span").text(count)
            $(".rpt-count b").text(count);
            $(".rpv-count b").text(shopData.length);
            $(".all-checked-label b").text(shopData.length);
        },
        setCarData() {
            localStorage.shopList = JSON.stringify(shopData);
        },
        getData(){
            var data = localStorage.shopList || '[]';
            this.setShopData(JSON.parse(data));
        },
        setShopData(data){
            $showBox.html('');
            shopData = data;
            data.forEach(x => {
                count += x.jp - 0;
                const str = `
                <li class="item item-line main-item clearfix">
                    <div class="cart-prod clearfix">
                        <a href="javascript:;" class="check check-item checked">
                            <i></i>
                        </a>
                        <a href="" class="item-pic">
                            <img src="${x.url}" alt="">
                        </a>
                        <a href="" class="item-tit">${x.t}
                        </a>
                        <div class="item-price">
                            <p>${x.jp}</p>
                        </div>
                        <div class="item-num">
                            <div class="num-act clearfix">
                                <a href="javascript:;" class="minus unable">-</a>
                                <input type="text" name="" id="num" value="${x.num}">
                                <a href="javascript:;" class="add">+</a>
                            </div>
                            <span class="stock partial limit"></span>
                            <span class="stock"></span>
                        </div>
                        <div class="item-amount">
                            <div class="item-a-money">${x.jp}</div>
                            <div class="item-a-weight">0.2kg</div>
                        </div>
                        <div class="item-act">
                            <a class="collect-btn" href="javascript:;">
                                <i class="iconfont icon-guanzhu"></i>
                            </a>
                            <a class="del-btn" href="javascript:;">
                                <i class="iconfont icon--"></i>
                            </a>
                        </div>
                    </div>
                </li>
                `
                $showBox.append(str);
            })
        },
        showDiv(){
            if(localStorage.data){
                $showDatabox.css("display", "block");
                $noneDataBox.css("display", "none");
            } else {
                $showDatabox.css("display", "none");
                $noneDataBox.css("display", "block");
            }
        }
    }
}())

Cart.init(".yhd-cart-content");