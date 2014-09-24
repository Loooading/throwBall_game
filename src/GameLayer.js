/**
 * Created by liuhujun on 14-8-18.
 */


var GameLayer = cc.Layer.extend({
    ball:null,
    moveVect:null,
    space:null,
    ctor : function(){
        this._super();
        this.init();
    },
    init : function(){
        var winsize = cc.winSize;
        var ballStartPos = cc.p(winsize.width/2, winsize.height);
        this.moveVect = cp.v(0,0);
        this.space = new cp.Space();
        this.initPhysics();
        this.anchor(0, 0);
        var sprite =  this.createPhysicsCircleSprite( ballStartPos );

        this.addChild( sprite, 100, 1 );

        var

        this.setupDebugNode();
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);

        this.scheduleUpdate();
    },

        onTouchBegan:function(touch, event) {
            cc.log("onTouchBegan");
            var target = event.getCurrentTarget();    // 获取事件所绑定的 target
            // 获取当前点击点所在相对按钮的位置坐标
            var locationInNode = target.convertToNodeSpace(touch.getLocation());
            var s = target.getContentSize();
            var rect = cc.rect(0, 0, s.width, s.height);

            if (cc.rectContainsPoint(rect, locationInNode)) {        // 点击范围判断检测
                target.opacity = 180;
//                target.body.applyImpulse(cp.v(100,100), cp.v(0,0));
                return true;
            }
            return false;
        },

        onTouchMoved:function(touch, event) {
            var target = event.getCurrentTarget();
            var delta = touch.getDelta();

            target.moveVect.x += delta.x;
            target.moveVect.y += delta.y;

        },

        onTouchEnded:function(touch, event) {
            var target = event.getCurrentTarget();    // 获取事件所绑定的 target
            // 获取当前点击点所在相对按钮的位置坐标
            var locationInNode = target.convertToNodeSpace(touch.getLocation());
            var s = target.getContentSize();
            var rect = cc.rect(0, 0, s.width, s.height);

            if (cc.rectContainsPoint(rect, locationInNode)) {        // 点击范围判断检测
                target.opacity = 180;
                target.getChildByTag(1).body.applyImpulse(target.moveVect, cp.v(0,0));
                target.moveVect = cp.v(0,0);
                return true;
            }
        },

    update:function (dt) {
        this.space.step(dt);
    },

    initPhysics:function() {
        var space = this.space ;
        var staticBody = space.staticBody;
        var winSize = cc.director.getWinSize();

        // Walls


        var bays = [ new cp.SegmentShape( staticBody, cp.v(0,200), cp.v(300,200), 10),                // bottom
            new cp.SegmentShape( staticBody, cp.v(200,480), cp.v(480,480), 10)// right
        ];

        for( var i=0; i < bays.length; i++ ) {
            var shape = bays[i];
            shape.setElasticity(1);
            shape.setFriction(1);
            space.addStaticShape( shape );
        }
        // Gravity
        space.gravity = cp.v(0, -100);
    },

    createPhysicsCircleSprite:function( pos ) {

        var radius = 20;
        var mass = 1;
        var body = new cp.Body(mass, cp.momentForCircle(mass, 0, radius,cp.v(0, 0)));
        body.setPos( pos );
        this.space.addBody( body );
        var shape = new cp.CircleShape(body, radius,cp.v(0, 0)); //new cp.BoxShape( body, 48, 108);
        shape.setElasticity( 1 );//弹性
        shape.setFriction( 50 );//摩擦力


        this.space.addShape( shape );

        var sprite = cc.PhysicsSprite.create(res.CloseNormal_png);
        sprite.setBody( body );
        return sprite;
    },

    setupDebugNode:function()
    {
        // debug only
        this._debugNode = cc.PhysicsDebugNode.create( this.space );
        this._debugNode.visible = true ;
        this.addChild( this._debugNode );
    }
});

var GameScene = cc.Scene.extend({
    space : null,
    initPhysics:function() {
    //1. new space object
    this.space = new cp.Space();
    //2. setup the  Gravity
    this.space.gravity = cp.v(0, -350);

    // 3. set up Walls
    var wallBottom = new cp.SegmentShape(this.space.staticBody,
        cp.v(0, g_groundHight),// start point
        cp.v(4294967295, g_groundHight),// MAX INT:4294967295
        0);// thickness of wall
    this.space.addStaticShape(wallBottom);
},
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
})
