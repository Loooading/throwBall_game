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
        var centPos = cc.p(winsize.width/2, winsize.height);
        this.moveVect = cp.v(0,0);
        this.space = new cp.Space();
        this.initPhysics();

        //this.createPhysicsSprite(centPos);
        var sprite =  this.createPhysicsCircleSprite( centPos );
//        var spriteBox1 = this.createPhysicsPolySprite( centPos );
//        var spriteBox1 = this.createPhysicsPolySprite( centPos );
//        var spriteBox2 = this.createPhysicsPolySprite( centPos );
//
          this.addChild( sprite, 100, 1 );
//        this.addChild( spriteBox1, 100, 2);
//        this.addChild( spriteBox2, 100, 3);
//        cp.PinJoint(spriteBox1, spriteBox2, spriteBox1.getAnchorPoint(), spriteBox2.getAnchorPoint());

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
        var walls = [ new cp.SegmentShape( staticBody, cp.v(0,0), cp.v(winSize.width,0), 0 ),                // bottom
            new cp.SegmentShape( staticBody, cp.v(0,winSize.height), cp.v(winSize.width,winSize.height), 0),    // top
            new cp.SegmentShape( staticBody, cp.v(0,0), cp.v(0,winSize.height), 0),                // left
            new cp.SegmentShape( staticBody, cp.v(winSize.width,0), cp.v(winSize.width,winSize.height), 0)    // right
        ];

        for( var i=0; i < walls.length; i++ ) {
            var shape = walls[i];
            shape.setElasticity(1);
            shape.setFriction(1);
            space.addStaticShape( shape );
        }

        var bucket = [ new cp.SegmentShape( staticBody, cp.v(200,0), cp.v(300,0), 0 ),                // bottom
                       new cp.SegmentShape( staticBody, cp.v(200,0), cp.v(180,100), 0),                // left
                       new cp.SegmentShape( staticBody, cp.v(300,0), cp.v(320,100), 0)    // right
        ];

        for( var i=0; i < bucket.length; i++ ) {
            var shape = bucket[i];
            shape.setElasticity(1);
            shape.setFriction(1);
            space.addStaticShape( shape );
        }

        var bay = [ new cp.SegmentShape( staticBody, cp.v(0,200), cp.v(300,200), 0 ),                // bottom
            new cp.SegmentShape( staticBody, cp.v(200,480), cp.v(480,480), 0)// right
        ];

        for( var i=0; i < bay.length; i++ ) {
            var shape = bay[i];
            shape.setElasticity(1);
            shape.setFriction(1);
            space.addStaticShape( shape );
        }
        // Gravity
        space.gravity = cp.v(0, -100);
    },

    createPhysicsCircleSprite:function( pos ) {

        var radius = 50;
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

    createPhysicsPolySprite:function( pos ) {

        //var radius = 20;
        var mass = 2;

        var body = new cp.Body(mass, cp.momentForBox(mass, 50, 200));
        body.setPos( pos );
        this.space.addBody( body );
        var shape = new cp.BoxShape(body, 50, 200); //new cp.BoxShape( body, 48, 108);
        shape.setElasticity( 0.5 );
        shape.setFriction( 0.1 );

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
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
})
