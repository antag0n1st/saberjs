(function (window, undefined) {

    function GuiScreen() {
        this.initialize();
    }

    GuiScreen.prototype = new HScreen();
    GuiScreen.prototype.screenInitialize = GuiScreen.prototype.initialize;

    GuiScreen.prototype.initialize = function () {
        this.screenInitialize();

        this.setBackgroundColor("#0e8477");

        this.content = new InputContent(this);
        this.addTouchable(this.content);
        this.addChild(this.content);

        var backBtn = new Button('back', Style.DEFAULT_BUTTON);
        backBtn.setSensorSize(220, 100);
        backBtn.onMouseDown = function () {
            Sounds.click.play();
            app.navigator.goBack();
        };
        backBtn.position.set(100 + (backBtn.background.width / 2), 50);
        this.content.addChild(backBtn);
        this.addTouchable(backBtn);


        var label = new Label(Style.DEFAULT_LABEL);
        label.position.set(100, 100);
        label.txt = "This is the Text.";
        this.content.addChild(label);

        var multyLineLabel = new Label(Style.MULTY_LINE_LABEL);
        multyLineLabel.position.set(100, 200);
        multyLineLabel.txt = "Most people look forward to retiring, and Burlington native Dennis Woody, 66, is no exception. The sales manager began his career in 1971 as a truck drive for the company, which was once called R.F. Kilpatrick and Sons. ";
        this.content.addChild(multyLineLabel);

        var button = new Button('button', Style.DEFAULT_BUTTON);
    //    button.setSensorSize(220, 100);
        button.onMouseDown = function () {
            log("btn clicked")
        };
        button.position.set(100 + (button.background.width / 2), 450);
        this.content.addChild(button);
        this.addTouchable(button);
        
       // button.imageNormal = 'item1';

        var button2 = new Button("STRETCHED BUTTON", Style.ROUNDED_BUTTON, Button.TYPE_NINE_SLICE);
        button2.background.setSize(500, 100);
        button2.setSensorSize(500, 100);
        button2.onMouseDown = function () {
            log("round btn clicked");
        };
        button2.position.set(100 + (button2._width / 2), 550);
        this.content.addChild(button2);
        this.addTouchable(button2);

        //////////////// TABLE VIEW

        var label2 = new Label(Style.DEFAULT_LABEL);
        label2.position.set(1000, 100);
        label2.txt = "Table View";
        this.content.addChild(label2);

        // set nine slice background
        var background = new NineSlice('rounded', '15');
        background.setSize(320, 520);
        background.position.set(1000 + 150, 200 + 250);
        this.content.addChild(background);

        var data = [];
        for (var i = 0; i < 20; i++) {
            data.push({
                text: "Data Text " + i
            });
        }

        this.tableview = new TableView();
        this.tableview.setCellType(TableCell);
        this.tableview.setSize(300, 500);
        this.tableview.setData(data);
        this.tableview.initCells();

        this.tableview.position.set(1000, 200);
        this.content.addChild(this.tableview);
        this.addTouchable(this.tableview);

        // keyboard

        this.input1 = new InputField(Style.DEFAULT_INPUT, InputField.TYPE_ALL);
        this.input1.setSize(400, 80);
        this.input1.position.set(1600, 200);
        this.input1.hasNext = true;
        this.input1.setPlaceholder("Placeholder");
        this.content.addChild(this.input1);
        this.content.addInput(this.input1);

        this.input2 = new InputField(Style.DEFAULT_INPUT, InputField.TYPE_NUMERIC_SYMBOLS);
        this.input2.setSize(400, 120);
        this.input2.setFontSize(50);
        this.input2.position.set(1600, 320);
        this.input2.hasNext = true;
        this.content.addChild(this.input2);
        this.content.addInput(this.input2);

        this.input3 = new InputField(Style.DEFAULT_INPUT, InputField.TYPE_ALPHABETIC);
        this.input3.setSize(400, 80);
        this.input3.setFontSize(50);
        this.input3.position.set(1600, 440);
        this.content.addChild(this.input3);
        this.content.addInput(this.input3);

        ///////////// Scroll View

        this.scrollView = new ScrollView();
        this.scrollView.setSize(500, 300);
        this.scrollView.setContentSize(700, 533);
        this.scrollView.position.set(100, 700);
        this.content.addChild(this.scrollView);
        this.addTouchable(this.scrollView);

        var itm1 = new Sprite('photo');
        this.scrollView.content.addChild(itm1);

        this.loadingBar = new LoadingBar('_loading_bar_fg', '_loading_bar_bg');
        this.loadingBar.position.set(800, 1000);
        this.loadingBar.setPercent(0.2, true);
        this.addChild(this.loadingBar);

        // layout

        var items = [];

        for (var i = 0; i < 20; i++) {
            var item = new Sprite('white');
            var w = Math.randomInt(10, 100);
            var h = Math.randomInt(10, 100);
            item.stretch(w, h)
            item.setSensorSize(w, h);
            items.push(item);
            this.addChild(item);
        }

        Layout.hbox(items, 400, 1450, 600, 5, 'compact');


    };

    GuiScreen.prototype.update = function (dt) {

    };

    GuiScreen.prototype.onShow = function () {

    };

    GuiScreen.prototype.onHide = function () {

    };

    GuiScreen.prototype.onResize = function () {

    };


    window.GuiScreen = GuiScreen; // make it available in the main scope

}(window));