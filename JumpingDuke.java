/**
	JumpingDuke v1.0
	A new version of Jumping Jack

	author: Robert Cioch 1998
*/
//###################################################################

import java.applet.*;
import java.awt.*;
import java.awt.image.*;

public class JumpingDuke extends Applet implements Runnable
{
	private final String copyright = "Applet coded by RC in 1998, 1999 ";

	Thread th = null;
	Image iup,idown;
	Graphics iugr, idgr;
	static final int SX = 640;
	static final int SY = 479;
	static final int GRID = 68;

	Image dukejump[] = new Image[13];
	Image dukeflipleft[] = new Image[14];
	Image dukeflipright[] = new Image[14];

	int line1[] = new int[20];
	int line2[] = new int[20];
	int line3[] = new int[20];
	int line4[] = new int[20];
	int line5[] = new int[20];
	int line6[] = new int[20];
	int line7[] = new int[20];
	int line8[] = new int[20];

	int line1stat[] = new int[3];
	int line2stat[] = new int[3];
	int line3stat[] = new int[3];
	int line4stat[] = new int[3];
	int line5stat[] = new int[3];
	int line6stat[] = new int[3];
	int line7stat[] = new int[3];
	int line8stat[] = new int[3];

	boolean goLeft;
	boolean goRight;
	boolean goJump;

	int movetype = 0;			// 0 = no move, 1 = jump, 2 = left, 3 = right, 4 = fall down
	int movephase = 0;

	int level = 1;
	int xduke = SX/2, yduke;
	int speed = 2;
	int nextlevel = 0;

	AudioClip aBegin, aEnd, aAjajaj, aAutsh, aFalling, aHop, aJupi, aOkay;
	Image bimages[] = new Image[4];
	Image backimage;

//---------------------------------------------------------
	public AudioClip getMeThatClip(String name)
	{
		AudioClip ac = getAudioClip(getDocumentBase(), name);
		ac.play(); ac.stop();
		return ac;
	}
//---------------------------------------------------------
	public Image getMeThatImage(String name)
	{
		MediaTracker mt = new MediaTracker(this);
		Image img = getImage(getDocumentBase(), name); mt.addImage(img,0);
		try {
			mt.waitForID(0);
		} catch (InterruptedException e) {}
		return img;
	}
//---------------------------------------------------------
	public void init()
	{
		resize(648,508);


		aBegin = getMeThatClip("hi.au");
		aEnd = getMeThatClip("dont.au");
		aAjajaj = getMeThatClip("ajajaj.au");
		aAutsh = getMeThatClip("autsh.au");
		aFalling = getMeThatClip("falling.au");
		aHop = getMeThatClip("ihop.au");
		aJupi = getMeThatClip("jupi.au");
		aOkay = getMeThatClip("okay.au");

		bimages[0] = getMeThatImage("back4.gif");
		bimages[1] = getMeThatImage("back3.gif");
		bimages[2] = getMeThatImage("back2.gif");
		bimages[3] = getMeThatImage("back1.gif");

		backimage = bimages[0];

		MediaTracker mt = new MediaTracker(this);
		ImageFilter filter;
		Image oi;

		oi = getMeThatImage("jump.gif");
		for (int i = 0; i < 13; i++)
		{
			filter = new CropImageFilter(0,65*i,70,65);
			dukejump[i] = createImage(new FilteredImageSource(oi.getSource(), filter));
			mt.addImage(dukejump[i], 0);
		}
		try {
			mt.waitForID(0);
		} catch (InterruptedException e) {}


		oi = getMeThatImage("flipleft.gif");
		for (int i = 0; i < 14; i++)
		{
			filter = new CropImageFilter(0,80*i,130,80);
			dukeflipleft[i] = createImage(new FilteredImageSource(oi.getSource(), filter));
			mt.addImage(dukeflipleft[i], 0);
		}
		try {
			mt.waitForID(0);
		} catch (InterruptedException e) {}

		oi = getMeThatImage("flipright.gif");
		for (int i = 0; i < 14; i++)
		{
			filter = new CropImageFilter(0,80*i,130,80);
			dukeflipright[i] = createImage(new FilteredImageSource(oi.getSource(), filter));
			mt.addImage(dukeflipright[i], 0);
		}
		try {
			mt.waitForID(0);
		} catch (InterruptedException e) {}


		setBackground(Color.lightGray);
		iup = createImage(SX,SY); idown = createImage(SX,16);
		iugr = iup.getGraphics(); idgr = idown.getGraphics();
		iugr.setColor(Color.black); iugr.fillRect(0,0,SX,SY);
		idgr.setFont(new Font("Helvetica", Font.BOLD, 14));

		initLevel();
	}
//---------------------------------------------------------
	public void start()
	{

		for (int i = 0; i < 20; i++)
		{
			line1[i] = -1;
			line2[i] = -1;
			line3[i] = -1;
			line4[i] = -1;
			line5[i] = -1;
			line6[i] = -1;
			line7[i] = -1;
			line8[i] = -1;
		}
		line1stat[0] = -1;
		line2stat[0] = -1;
		line3stat[0] = -1;
		line4stat[0] = -1;
		line5stat[0] = -1;
		line6stat[0] = -1;
		line7stat[0] = -1;
		line8stat[0] = -1;

		level = 1;
		initLevel();

		if (th == null)
		{
			th = new Thread(this);
			th.start();
		}

		aBegin.play();

	}

//---------------------------------------------------------
	public void initLevel()
	{
		int m = 300 - level*20;
		if (level >=10) m = 200 - level*10;

		line1stat[1] = m-70; line1stat[2] = 92-level*4;
		line2stat[1] = m-60; line2stat[2] = 93-level*4;
		line3stat[1] = m-50; line3stat[2] = 94-level*4;
		line4stat[1] = m-40; line4stat[2] = 95-level*4;
		line5stat[1] = m-30; line5stat[2] = 96-level*4;
		line6stat[1] = m-20; line6stat[2] = 97-level*4;
		line7stat[1] = m-10; line7stat[2] = 98-level*4;
		line8stat[1] = m;    line8stat[2] = 99-level*4;

		if (level == 1)			// at lev 1 make sure it won't fall down
		{
			line8stat[2] = 100;
			for (int i = 0; i < 20; i++)
				line8[i] = -1;
		}

		goLeft = false; goRight = false; goJump = false;

		yduke = 7;
		if (nextlevel == -1) yduke = 1;

		backimage = bimages[ level % 4 ];
		nextlevel = 0;
	}
//---------------------------------------------------------
	public void stop()
	{
		aEnd.play();

		th = null;
		try { Thread.sleep(100);
		} catch (InterruptedException e) {}

	}
//---------------------------------------------------------
	public void run()
	{
		Thread.currentThread().setPriority(Thread.NORM_PRIORITY-1);

		while (th != null)
		{

			if (nextlevel !=0)
			{
				if (nextlevel == 1)
					aJupi.play();
				else
					aAjajaj.play();

				level += nextlevel; initLevel();
			}


			if (movetype == 0)
			{
				if (goLeft)
				{
					movetype = 2;
					aOkay.play();
				}

				if (goRight)
				{
					movetype = 3;
					aOkay.play();
				}

				if (goJump)
					if (canDrop(yduke-1))
					{
						movetype = 1;
						aHop.play();
					}
					else
					{
						movetype = 5;
						aAutsh.play();
					}

				if (canDrop())
				{
					movetype = 4;
					aFalling.play();
				}
			}


			repaint();
//			Thread.yield();
			try { Thread.sleep(30);	} catch (InterruptedException e) {}
		}

	}
//---------------------------------------------------------
	public boolean canDrop(int i)
	{
		switch (i)
		{
			case 0: return canDrop0(line1);
			case 1: return canDrop0(line2);
			case 2: return canDrop0(line3);
			case 3: return canDrop0(line4);
			case 4: return canDrop0(line5);
			case 5: return canDrop0(line6);
			case 6: return canDrop0(line7);
			case 7: return canDrop0(line8);
		}
		return false;
	}

	public boolean canDrop()
	{
		return canDrop(yduke);
	}


	private boolean canDrop0(int t[])
	{
		boolean r = false;

		for (int i = 0; i < 10; i++)
			if (t[i*2] != -1 && (xduke+SX/2-12) > t[i*2] && (xduke+SX/2+12) < t[i*2+1])
				r = true;

		return r;
	}
//---------------------------------------------------------
	public int random(int i)
	{
		if (i<0) return 5;
		return (int)(Math.random()*i);
	}
//---------------------------------------------------------
	public void scrollFloorLeft(int tab[], int tstat[])
	{
		for (int i = 0; i < 10; i++)
			if (tab[i*2] != -1)
			{
				tab[i*2] -= speed; tab[i*2+1] -= speed;

				if (tab[i*2+1] <= SX/2)		// if exceed clear slot
				{
					tab[i*2] = -1; tab[i*2+1] = -1;
				}
			}

		if (tab[0] == -1)
		{
			for (int i = 0; i < 18; i++)
				tab[i] = tab[i+2];
		}

		if (tstat[0] > -1)
			tstat[0]--;
		else if ((int)(Math.random()*100)>tstat[2] && tab[18]==-1)// random okay & free slot
//		else if (random(100)>tstat[2] && tab[18]==-1)// random okay & free slot
		{
			int i = 0;
			while (tab[i] != -1 && tab[i+1] != -1)
				{ i += 2; }

			tab[i] = SX+SX/2; tab[i+1] = SX+SX/2 + 50 + level*10;
			tstat[0] = 75 + level*5 + (int)(Math.random()*tstat[1]);

//			tab[i] = SX+SX/2; tab[i+1] = SX+SX/2 + 70 + level*5;
//			tstat[0] = 75 + level*5 + random(tstat[1]);
		}
	}
//---------------------------------------------------------
	public void scrollFloorRight(int tab[], int tstat[])
	{
		for (int i = 0; i < 10; i++)
			if (tab[i*2] != -1)
			{
				tab[i*2] += speed; tab[i*2+1] += speed;

				if (tab[i*2] >= (SX+SX/2))		// if exceed clear slot
				{
					tab[i*2] = -1; tab[i*2+1] = -1;
				}
			}

		if (tstat[0] > -1)
			tstat[0]--;
		else if ((int)(Math.random()*100)>tstat[2] && tab[18]==-1)// random okay & free slot
//		else if (random(100)>tstat[2] && tab[18]==-1)// random okay & free slot
		{
			for (int i = 19; i > 1; i--)				// move all to the right
				tab[i] = tab[i-2];

			tab[0] = SX/2 - 50 - level*10; tab[1] = SX/2;
			tstat[0] = 75 + level*5 + (int)(Math.random()*tstat[1]);

//			tab[0] = SX/2 - 70 - level*5; tab[1] = SX/2;
//			tstat[0] = 70 + level*5 + random(tstat[1]);
		}
	}
//---------------------------------------------------------
	public void drawFloors(int tab[], int ypos)
	{
		int x1 = 0, x2 = SX*2;

		int i = 0;
		while (i < 19)
		{
			if (tab[i] == -1) break;
			else
			{
				x2 = tab[i]; drawBaseline(x1, x2, ypos);
				x1 = tab[i+1]; x2 = SX*2;
			}
			i += 2;
		}
		drawBaseline(x1, x2, ypos);
	}
//---------------------------------------------------------
	public void drawBaseline(int xl, int xr, int y)
	{
//System.out.println("Line from x1= "+xl+" to x2= "+xr);

		iugr.setColor(Color.gray);
		iugr.drawLine(xl-SX/2, y, xr-SX/2, y);
		iugr.drawLine(xl-SX/2, y+2, xr-SX/2, y+2);
		iugr.setColor(Color.darkGray);
		iugr.drawLine(xl-SX/2, y+1, xr-SX/2, y+1);
	}
//---------------------------------------------------------
	public void update(Graphics g)
	{
		paint(g);
	}
//---------------------------------------------------------
	public void paint(Graphics g)
	{

//		int xs = bi.getWidth(this);
//		int ys = bi.getHeight(this);
//		int xx = 640 / xs;
//		int yy = 480 / ys;

//		for (int x=0; x <= xx; x++)
//			for (int y=0; y <= yy; y++)
//				g.drawImage(bi, x*xs, y*ys, this);

		g.setColor(Color.lightGray);
		g.draw3DRect(0, 0, 647, 507, true);
		g.draw3DRect(3, 3, 641, 480, false);
		g.draw3DRect(3, 487, 641, 17, false);


		int xs = backimage.getWidth(this);
		int ys = backimage.getHeight(this);
		int xx = SX / xs;
		int yy = SY / ys;

		for (int x=0; x <= xx; x++)
			for (int y=0; y <= yy; y++)
				iugr.drawImage(backimage, x*xs, y*ys, this);

//		iugr.setColor(Color.black);
//		iugr.fillRect(0,0,SX,SY);


		scrollFloorRight(line1,line1stat);
		scrollFloorRight(line3,line3stat);
		scrollFloorRight(line5,line5stat);
		scrollFloorRight(line7,line7stat);
		scrollFloorLeft(line2,line2stat);
		scrollFloorLeft(line4,line4stat);
		scrollFloorLeft(line6,line6stat);
		scrollFloorLeft(line8,line8stat);

		drawFloors(line1,GRID*0);
		drawFloors(line2,GRID*1);
		drawFloors(line3,GRID*2);
		drawFloors(line4,GRID*3);
		drawFloors(line5,GRID*4);
		drawFloors(line6,GRID*5);
		drawFloors(line7,GRID*6);
		drawFloors(line8,GRID*7);

		switch (movetype)
		{
			case 0:
				iugr.drawImage(dukejump[0], xduke-35, yduke*GRID+3-GRID, this);
				break;
			case 1:
				switch (movephase)
				{
					case 0: yy = -10; break;
					case 1: yy = -30; break;
					case 2: yy = -60; break;
					case 3: yy = -80; break;
					case 4: yy = -85; break;
					case 5: yy = -70; break;
					case 6: yy = -60; break;

					case 7: yy = -GRID; break;
					case 8: yy = -GRID; break;
					case 9: yy = -GRID; break;
					case 10: yy = -GRID; break;
				}

				iugr.drawImage(dukejump[movephase+1], xduke-35, yduke*GRID+3-GRID+yy, this);

				if (++movephase == 11)
				{
					movephase = 0; movetype = 0;
					if (--yduke == 0) nextlevel = 1;
				}
				break;
			case 2:
				iugr.drawImage(dukeflipleft[movephase], xduke-96+movephase*4, yduke*GRID-12-GRID, this);

				if (xduke < 0)
					iugr.drawImage(dukeflipleft[movephase], xduke-96+movephase*4+SX, yduke*GRID-12-GRID, this);

				xduke -= 4;
				if (++movephase == 14)
				{
					movephase = 0; movetype = 0;
					xduke -= 4;
					if (xduke < 0) xduke += SX;
				}

				if (canDrop())
				{
					movephase = 1; movetype = 4;
					aFalling.play();
				}
				break;
			case 3:
				iugr.drawImage(dukeflipright[movephase], xduke-32-movephase*4, yduke*GRID-12-GRID, this);

				if (xduke > SX)
					iugr.drawImage(dukeflipright[movephase], xduke-32-movephase*4-SX, yduke*GRID-12-GRID, this);

				xduke += 4;
				if (++movephase == 14)
				{
					movephase = 0; movetype = 0;
					xduke += 4;
					if (xduke > SX) xduke -= SX;
				}

				if (canDrop())
				{
					movephase = 1; movetype = 4;
					aFalling.play();
				}
				break;
			case 4:
				switch (movephase)
				{
					case 0: yy = 01; xx =  1; break;
					case 1: yy = 02; xx =  2; break;
					case 2: yy = 06; xx =  3; break;
					case 3: yy = 10; xx =  4; break;
					case 4: yy = 20; xx =  5; break;
					case 5: yy = 35; xx =  6; break;
					case 6:	yy = 0; xx =  7;
						if (++yduke == 8) nextlevel = -1;
						if (canDrop()) movephase = 19;
						break;
					case 7: yy = 0; xx =  8; break;
					case 8: yy = 0; xx =  9; break;
					case 9: yy = 0; xx = 10; break;
					case 10: yy = 0; xx = 11; break;

					case 20: yy = 15; xx =  6; break;
					case 21: yy = 30; xx =  5; break;
					case 22: yy = 45; xx =  6; break;
					case 23: yy = 00; xx =  7;
						if (++yduke == 8) nextlevel = -1;
						if (canDrop())
							movephase = 19;
						else
							movephase = 6;

					break;

				}
				iugr.drawImage(dukejump[xx], xduke-35, yduke*GRID+3-GRID+yy, this);

				if (++movephase == 11)
				{
					movephase = 0; movetype = 0;
				}
				break;
			case 5:
				switch (movephase)
				{
					case 0: yy = -00; xx =  1; break;
					case 1: yy = -01; xx =  2; break;
					case 2: yy = -02; xx =  3; break;
					case 3: yy = -02; xx = 12; break;

					case 4: yy = -00; xx =  8; break;
					case 5: yy = -00; xx =  9; break;
					case 6: yy = -00; xx = 10; break;
					case 7: yy = -00; xx = 11; break;
				}

				iugr.drawImage(dukejump[xx], xduke-35, yduke*GRID+3-GRID+yy, this);

				if (++movephase == 8)
				{
					movephase = 0; movetype = 0;
				}
				break;
		}


		g.drawImage(iup, 4, 4, this);

		if (th != null)
		{
			idgr.setColor(Color.black);
			idgr.fillRect(0, 0, SX, 16);
			idgr.setColor(Color.white);

			idgr.drawString("Level: "+level, 8, 12);
			idgr.drawString("JumpingDuke coded by Borg in 1998, 1999", SX/4, 12);
		}

		g.drawImage(idown, 4, 488, this);

	}

//---------------------------------------------------------
	public boolean keyDown(Event e, int k)
	{
		switch (k)
		{
			case Event.LEFT: goLeft = true; break;
			case Event.RIGHT: goRight = true; break;
			case Event.UP: goJump = true; break;
			case 32: goJump = true; break;
		}
		return true;
	}
//---------------------------------------------------------
	public boolean keyUp(Event e, int k)
	{
		goLeft = false; goRight = false; goJump = false;
		return true;
	}

//---------------------------------------------------------
	public boolean mouseExit(Event e, int x, int y)
	{
		showStatus("");
		return true;
	}
//---------------------------------------------------------
	public boolean mouseEnter(Event e, int x, int y)
	{
		showStatus(copyright);
		return true;
	}


}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
