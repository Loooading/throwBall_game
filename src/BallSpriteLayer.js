/**
 * Created by liuhujun on 14-9-3.
 */
var BallSpriteLayer = cc.Layer.extend({
    space:null,
    body:null,
    shape:null,
    sprite:null,
    moveVect:null,
    ctor:function(space) {
        this._super();
        this.space = space;
        this.init();
    },

    init:function(){
        this._super();
        this.initBallSprite();
        this.initTopBox();
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);

        //this.scheduleUpdate();
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

    initBallSprite:function(){
        var radius = 20;
        this.moveVect = cp.v(0,0);
        this.sprite = cc.PhysicsSprite.create(res.CloseNormal_png);
        this.body = new cp.Body(1, cp.momentForCircle(1, 0, radius,cp.v(0, 0)));
        var pos = cc.p(200,760);
        this.body.setPos( pos );
        this.space.addBody( this.body );
        this.shape = new cp.CircleShape(this.body, radius,cp.v(0, 0)); //new cp.BoxShape( body, 48, 108);
        this.shape.setElasticity( 0.2 );//弹性
        this.shape.setFriction( 1 );//摩擦力
        this.shape.setCollisionType(SpriteTag.ball);
        this.space.addShape( this.shape );
        this.sprite.setBody( this.body );
        this.addChild(this.sprite,1,1);
    },

    initTopBox:function(){
        var winSize = cc.director.getWinSize();
        var sprite = cc.PhysicsSprite.create();
        var body = new cp.StaticBody();
        body.setPos(cc.p(240, 780));
        sprite.setBody(body);
        var shape = new cp.BoxShape(body, 480, 40);
        shape.setCollisionType(SpriteTag.top);
        this.space.addStaticShape(shape);
        this.addChild(sprite);
    }

})